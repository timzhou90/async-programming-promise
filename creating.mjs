
export function timeout() {
  const wait = new Promise((resolve) => {
    setTimeout(() => {
      resolve("timeout");
    }, 1500);
  });

  wait.then((text) => setText(text));
}

export function interval() {
  let counter = 0;
  const wait = new Promise((resolve) => {
    setInterval(() => {
      console.log("interval" + counter);
      resolve(`timeout ${++counter}`);
    }, 1500);
  });

  wait
    .then((text) => setText(text))
    .finally(() => appendText(`-- Done ${counter}`));
}

export function clearIntervalChain() {
  let counter = 0;
  let interval;
  const wait = new Promise((resolve) => {
    setInterval(() => {
      console.log("interval" + counter);
      resolve(`timeout ${++counter}`);
    }, 1500);
  });

  wait.then((text) => setText(text)).finally(() => clearInterval(interval));
}

export function xhr() {
  let request = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("get", "http://localhost:3000/users/7");
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        resolve(xhr.statusText);
      }
    };
    xhr.onerror = () => reject("request failed");
    xhr.send();
  });
  request.then((result) => setText(result)).catch((reason) => setText(reason));
}

export function allPromises() {
  let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  Promise.all([categories, statuses, userTypes])
    .then(([cat, stat, type]) => {
      setText("");
      appendText(JSON.stringify(cat.data));
      appendText(JSON.stringify(stat.data));
      appendText(JSON.stringify(type.data));
    })
    .catch((res) => {
      setText(res);
    });
}

export function allSettled() {
  let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  Promise.allSettled([categories, statuses, userTypes])
    .then((values) => {
      let results = values.map((v) => {
        if (v.status === "fulfilled") {
          return `fulfilled : ${JSON.stringify(v.value.data[0])} `;
        }
        return `REJECTED : ${v.reason.message} `;
      });
      setText(results);
    })
    .catch((res) => {
      setText(res);
    });
}

export function race() {
  let users = axios.get("http://localhost:3000/users");
  let backup = axios.get("http://localhost:3001/users");

  Promise.race([users, backup])
    .then((users) => setText(JSON.stringify(users.data)))
    .catch((res) => setText(res));
}
