if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    let userTriggeredRefresh = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!userTriggeredRefresh) return;
      userTriggeredRefresh = false;
      window.location.reload();
    });

    navigator.serviceWorker.register("./sw.js").then((reg) => {
      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            import("./app-shell.js").then(({ showToast }) => {
              const toast = showToast("Update available — tap to refresh", "info", { persist: true });
              toast.style.cursor = "pointer";
              toast.addEventListener("click", () => {
                userTriggeredRefresh = true;
                installing.postMessage("skipWaiting");
              }, { once: true });
            });
          }
        });
      });
    }).catch(() => {});
  });
}
