function getRules(name, callback) {
  chrome.storage.sync.get(name, (result) => {
    callback(Array.isArray(result[name]) ? result[name] : []);
  });
}

function addRule(projectName, newRule) {
  getRules(projectName, (rules) => {
    chrome.storage.sync.set({
      [projectName]: rules.concat(newRule)
    });
  });
}

function removeRule(projectName, ruleToRemove) {
  getRules(projectName, (rules) => {
    chrome.storage.sync.set({
      [projectName]: rules.filter((rule) => rule !== ruleToRemove)
    });
  });
}

export default {
  getRules,
  addRule,
  removeRule
};
