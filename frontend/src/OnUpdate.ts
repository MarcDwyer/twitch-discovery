function OnUpdateHandler(registration: any) {
  // Make sure that any new version of a service worker will take over the page
  // and become activated immediately.
  const waitingServiceWorker = registration.waiting;
  if (waitingServiceWorker) {
    waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
  }

  const link = document.createElement("a");
  link.classList.add("update-notification");
  link.setAttribute("href", "#");
  link.innerHTML = "Update is available. Click here to install.";

  link.addEventListener("click", e => {
    e.preventDefault();
    window.location.reload();
  });

  //@ts-ignore
  document.querySelector("body").appendChild(link);
}

export default OnUpdateHandler;
