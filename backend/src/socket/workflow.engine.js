// Workflow engine stub
module.exports = {
  execute: async (workflow, context) => {
    return { status: 'completed', result: context };
  },
  
  register: (name, handler) => {
    return true;
  }
};
