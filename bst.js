class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    const sortedArray = [...new Set(array)].sort((a, b) => a - b); // Rimuove duplicati e ordina
    this.root = this.buildTree(sortedArray);
  }

  // Costruisce il BST
  buildTree(array) {
    if (array.length === 0) return null;

    const mid = Math.floor(array.length / 2);
    const root = new Node(array[mid]);

    root.left = this.buildTree(array.slice(0, mid));
    root.right = this.buildTree(array.slice(mid + 1));

    return root;
  }

  // Inserimento
  insert(value, node = this.root) {
    if (node === null) return new Node(value);
    if (value === node.data) return node; // non inserire duplicati
    if (value < node.data) node.left = this.insert(value, node.left);
    else node.right = this.insert(value, node.right);
    return node;
  }

  // Rimozione
  delete(value, node = this.root) {
    if (!node) return null;

    if (value < node.data) node.left = this.delete(value, node.left);
    else if (value > node.data) node.right = this.delete(value, node.right);
    else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      let minLargerNode = node.right;
      while (minLargerNode.left) minLargerNode = minLargerNode.left;
      node.data = minLargerNode.data;
      node.right = this.delete(minLargerNode.data, node.right);
    }
    return node;
  }

  // Ricerca
  find(value, node = this.root) {
    if (!node) return null;
    if (value === node.data) return node;
    return value < node.data ? this.find(value, node.left) : this.find(value, node.right);
  }

  // Traversals
  levelOrderForEach(callback) {
    if (!callback) throw new Error("Callback required");
    const queue = [this.root];
    while (queue.length) {
      const node = queue.shift();
      callback(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  inOrderForEach(callback, node = this.root) {
    if (!callback) throw new Error("Callback required");
    if (!node) return;
    this.inOrderForEach(callback, node.left);
    callback(node);
    this.inOrderForEach(callback, node.right);
  }

  preOrderForEach(callback, node = this.root) {
    if (!callback) throw new Error("Callback required");
    if (!node) return;
    callback(node);
    this.preOrderForEach(callback, node.left);
    this.preOrderForEach(callback, node.right);
  }

  postOrderForEach(callback, node = this.root) {
    if (!callback) throw new Error("Callback required");
    if (!node) return;
    this.postOrderForEach(callback, node.left);
    this.postOrderForEach(callback, node.right);
    callback(node);
  }

  // Altezza e Profondità
  height(node) {
    if (!node) return -1;
    return 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  depth(value, node = this.root, currentDepth = 0) {
    if (!node) return null;
    if (value === node.data) return currentDepth;
    return value < node.data
      ? this.depth(value, node.left, currentDepth + 1)
      : this.depth(value, node.right, currentDepth + 1);
  }

  // Controllo Bilanciamento
  isBalanced(node = this.root) {
    if (!node) return true;

    const heightDiff = Math.abs(this.height(node.left) - this.height(node.right));
    return heightDiff <= 1 && this.isBalanced(node.left) && this.isBalanced(node.right);
  }

  // Rebalance
  rebalance() {
    const nodes = [];
    this.inOrderForEach(node => nodes.push(node.data));
    this.root = this.buildTree(nodes);
  }
}

// Funzione prettyPrint
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) return;
  if (node.right !== null) prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
};

// Driver Script
const randomNumbers = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100));
const tree = new Tree(randomNumbers);

console.log("Albero iniziale:");
prettyPrint(tree.root);
console.log("Bilanciato?", tree.isBalanced());

// Stampa 
console.log("Level-order:");
tree.levelOrderForEach(node => console.log(node.data));
console.log("In-order:");
tree.inOrderForEach(node => console.log(node.data));
console.log("Pre-order:");
tree.preOrderForEach(node => console.log(node.data));
console.log("Post-order:");
tree.postOrderForEach(node => console.log(node.data));

// Unbalance aggiungendo valori > 100
[150, 200, 300].forEach(n => tree.insert(n));
console.log("Bilanciato dopo insert grandi?", tree.isBalanced());

// Rebalance
tree.rebalance();
console.log("Bilanciato dopo rebalance?", tree.isBalanced());
prettyPrint(tree.root);
