
const workercode = () => {
  onmessage = function(e) {
    console.log('Worker: Recieved message from main script.')
    const result = '';
  }

  onstart = (e) => {
    console.log(e.start);
  }
};

<<<<<<< HEAD
module.exports = workercode
=======
module.exports = 
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
