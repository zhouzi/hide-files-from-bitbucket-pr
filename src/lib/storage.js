function getRules(name, callback) {
  chrome.storage.sync.get(name, (result) => {
    callback(Array.isArray(result[name]) ? result[name] : []);
  });
}

function addRule(projectName, newRule, callback = () => {}) {
  getRules(projectName, (rules) => {
    chrome.storage.sync.set({
      [projectName]: rules.concat(newRule)
    }, callback);
  });
}

function removeRule(projectName, ruleToRemove, callback = () => {}) {
  getRules(projectName, (rules) => {
    chrome.storage.sync.set({
      [projectName]: rules.filter((rule) => rule !== ruleToRemove)
    }, callback);
  });
}

export default {
  getRules,
  addRule,
  removeRule
};
