
const workercode = () => {
  onmessage = function(e) {
    console.log('Worker: Recieved message from main script.')
    const result = '';
  }

  onstart = (e) => {
    console.log(e.start);
  }
};

module.exports = 