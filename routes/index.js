const express = require('express');
const os = require('os');
const router = express.Router();


function getCpuUsage() {
  const cpus = os.cpus();
  let user = 0;
  let nice = 0;
  let sys = 0;
  let idle = 0;
  let irq = 0;

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


function getLoadAverages() {
  return os.loadavg();
}

/* GET home page with server monitoring */
router.get('/', (req, res) => {
  const cpuUsage = getCpuUsage();
  const memoryUsage = getMemoryUsage();
  const loadAverages = getLoadAverages();

  const serverStats = {
    cpuUsage,
    memoryUsage,
    loadAverages,
    uptime: os.uptime(),
  };

  res.json({
    message: 'Crafto Mainline Server Running',
    serverStats,
  });
});

module.exports = router;