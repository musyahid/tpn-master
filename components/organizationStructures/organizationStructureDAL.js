const OrganizationStructure = require('./organizationStructure');

exports.save = async (context) => {
  let item = new OrganizationStructure(context);
  item = await item.save();
  return item;
};

exports.findById = async (id) => {
  const item = await OrganizationStructure.findOne({ _id: id });
  return item;
};

exports.findDescendants = async (id) => {
  const descendants = [];
  const stack = [];
  const item = await OrganizationStructure.collection.findOne({ _id: id });
  
  stack.push(item);
  while (stack.length > 0) {
    const currentnode = stack.pop();
    currentnode.childs = [];
    const children = await OrganizationStructure.collection.find({ parent: currentnode._id });
    while (await children.hasNext() === true) {
      const child = await children.next();
      currentnode.childs.push(child);
      // descendants.push(child);
      stack.push(child);
    }
    if (currentnode._id === id) {
      descendants.push(currentnode);
    }
  }

  return descendants;
};

exports.update = async (id, item) => {
  const result = await OrganizationStructure.updateOne({ _id: id }, { $set: item });
  return result;
};

exports.deleteById = async (id) => {
  const descendants = [];
  const deletedDescendants = [];
  const stack = [];
  const item = await OrganizationStructure.collection.findOne({ _id: id });

  stack.push(item);
  
  while (stack.length > 0) {
    const currentnode = stack.pop();
    currentnode.childs = [];
    
    const children = await OrganizationStructure.collection.find({ parent: currentnode._id });
    while (await children.hasNext() === true) {
      const child = await children.next();
      currentnode.childs.push(child);
      
      stack.push(child);
    }
    descendants.push(currentnode._id);
  }
  
  while (descendants.length > 0) {
    const deletedId = descendants.pop();
    const deleted = await OrganizationStructure.findOneAndDelete({ _id: deletedId });
    deletedDescendants.push(deleted);
  }

  return deletedDescendants;


  // const item = await OrganizationStructure.findOneAndDelete({ _id: id });
  // return item;
};

exports.findNodeByLevel = async (id, level) => {
  const descendants = [];
  const stack = [];
  const item = await OrganizationStructure.collection.findOne({ _id: id });
  
  stack.push(item);
  while (stack.length > 0) {
    const currentnode = stack.pop();
    currentnode.childs = [];
    const children = await OrganizationStructure.collection.find({ parent: currentnode._id });
    while (await children.hasNext() === true) {
      const child = await children.next();
        if(child.level === level){
          descendants.push(child);
        }
        stack.push(child);
    }
  }

  return descendants;
};
