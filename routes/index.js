const express = require('express');
const router = express.Router();
const os = require('os');
const mongoose = require('mongoose');
const pm2 = require('pm2'); 



router.ws('/', (ws, req) => {
  console.log('Client connected via WebSocket to /api/v1/limits');

  ws.onopen = function () {
    sendStatsToClient(ws);

  }

  const interval = setInterval(() => {
    sendStatsToClient(ws);
    console.log('Sent system stats to client');
  }, 5000);


  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});


async function getMongoDBStatus() {
  try {
    
    if (mongoose.connection.readyState === 1) {
      return { status: 'connected', message: 'MongoDB connected' };
    } else {
      return { status: 'disconnected', message: 'MongoDB disconnected' };
    }
  } catch (err) {
    return { status: 'error', message: 'MongoDB connection error: ' + err.message };
  }
 
}

async function sendStatsToClient(ws) {
  const cpuUsage = getCpuUsage();
  const memoryUsage = getMemoryUsage();
  const loadAverages = getLoadAverages();
  const mongoDBStatus = await getMongoDBStatus(); // MongoDB status
  const pm2Status = await getPM2Status(); 
  const stats = {
    cpuUsage,
    memoryUsage,
    loadAverages,
    uptime: os.uptime(),
    mongoDBStatus,
    pm2Status
  };

  ws.send(JSON.stringify(stats));
}

function getPM2Status() {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        reject({ status: 'error', message: 'PM2 connection error: ' + err.message });
        return;
      }

      pm2.list((err, processList) => {
        if (err) {
          reject({ status: 'error', message: 'PM2 list error: ' + err.message });
          return;
        }

       
        const pm2Status = processList.map(process => ({
          name: process.name,
          status: process.pm2_env.status, // Check if it's online or not
        }));

        resolve({ status: 'ok', message: pm2Status });
      });
    });
  });
}



function getCpuUsage() {
  const cpus = os.cpus();
  let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;
  for (let cpu of cpus) {
    user += cpu.times.user;
    nice += cpu.times.nice;
    sys += cpu.times.sys;
    idle += cpu.times.idle;
    irq += cpu.times.irq;
  }
  const total = user + nice + sys + idle + irq;
  return {
    user: (user / total) * 100,
    sys: (sys / total) * 100,
    ttl: ((user + sys) / total) * 100,
    idle: (idle / total) * 100,
    irq: (irq / total) * 100,
  };
}

function getMemoryUsage() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  return {
    total: totalMemory,
    free: freeMemory,
    used: usedMemory,
    usagePercentage: (usedMemory / totalMemory) * 100,
  };
}

// function getDiskUsage() {
//   return new Promise((resolve, reject) => {

//     checkDiskSpace('/')
//       .then((diskSpace) => {
//         const diskSpaceUsage = ((diskSpace.total - diskSpace.free) / diskSpace.total) * 100;
//         resolve(diskSpaceUsage);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// }

function getLoadAverages() {
  return os.loadavg();
}

module.exports = router;
