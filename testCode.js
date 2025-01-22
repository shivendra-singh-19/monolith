const Promise = require('bluebird');
async function stop(val) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (val % 2 == 0) {
        console.log('This is resolved', val, 'after : ', val, 's');
        resolve();
      }
      reject(`This shit failed for ${val}`);
    }, val * 1000);
  });
}

async function run() {
  const arr = [
    {
      fun: async () => {
        console.log('This is step 1');
        await stop(1);
      },
    },
    {
      fun: async () => {
        console.log('This is step 2');
        await stop(2);
      },
    },
    {
      fun: async () => {
        console.log('This is step 3');
        await stop(7);
      },
    },
    {
      fun: async () => {
        console.log('This is step 4');
        await stop(4);
      },
    },
  ];
  try {
    await Promise.map(
      arr,
      async (ar) => {
        try {
          return await ar.fun();
        } catch (err) {
          console.log(err);
        }
      },
      {
        concurrency: 2,
      }
    );
  } catch (err) {
    console.log(err);
  }

  //   console.log('This is step 2');
  //   await stop(2);
  //   console.log('This is step 3');
  //   await stop(3);
  //   console.log('This is step 4');
}

run();
