class Node {
    constructor(data = null){
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array){
        this.root = buildTree(array);
    }
}

function mergeSort(array) {
    if(array.length < 2){
        return array;
    }
    
  const mid = array.length / 2;
  const firstHalf = array.slice(0, mid);
  const secondHalf = array.slice(mid);
  
  const firstSortedHalf = mergeSort(firstHalf);
  const secondSortedHalf = mergeSort(secondHalf);
  
  return merge(firstSortedHalf, secondSortedHalf);
}

function merge(arr1, arr2){
    let arr = [];
    let i = 0;
    let j = 0;
    
    while(i < arr1.length && j < arr2.length) {
        if(arr1[i] < arr2[j]){
            arr.push(arr1[i]);
            i++;
        } else {
            arr.push(arr2[j]);
            j++;
        }
    }
    
    while(i < arr1.length){
        arr.push(arr1[i]);
        i++;
    }
    while(j < arr2.length){
        arr.push(arr2[j]);
        j++;
    }
    
    return arr;
}

function sortedArrayToBST(array, start, end){
    if(start > end) return null;

    let mid = Math.floor((start+end)/2);
    let node = new Node(array[mid]);

    node.left = sortedArrayToBST(array, start, mid-1);
    node.right = sortedArrayToBST(array, mid+1, end);

    return node;
}

function buildTree(array){
    const noDuplicatesArray = [...new Set(array)];
    const sortedArray = mergeSort(noDuplicatesArray);

    let start = 0;
    let end = sortedArray.length-1;

    return sortedArrayToBST(sortedArray, start, end);
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

function insert(root, val){
    if (root == null) {
        root = new Node(val);
        return root;
    }

    if(val < root.data)
        root.left = insert(root.left, val);
    else if(val > root.data)
        root.right = insert(root.right, val);

        return root;
}

function deleteNode(root, val){
    if(root == null) return root;

    if(root.data > val){
        root.left = deleteNode(root.left, val);
        return root;
    } else if (root.data < val) {
        root.right = deleteNode(root.right, val);
        return root;
    }

    if(root.left == null){
        let temp = root.right;
        delete root;
        return temp;
    } else if(root.right == null){
        let temp = root.left;
        delete root;
        return temp;
    } else {
        let succParent = root;

        let succ = root.right;
        while(succ.left != null){
            succParent = succ;
            succ = succ.left;
        }

        if(succParent !== root) succParent.left = succ.right;
        else succParent.right = succ.right;
        
        root.data = succ.data;
        delete succ;
        return root;
    }
}

function find(root, val){
    if(root.data == val) return root;
    if(root == null) return null;

    if(val < root.data) return find(root.left, val);
    else return find(root.right, val);
}

function levelOrder(root){
    if(!root) return [];

    let result = [];
    let queue = [root];

    while(queue.length>0){
        const node = queue.shift();
        result.push(node.data);

        if(node.left) queue.push(node.left);
        if(node.right) queue.push(node.right);
    }
    return result;
}

function inorder(root, arr=[]){
    if(!root) return;
    
    inorder(root.left, arr);
    arr.push(root.data);
    inorder(root.right, arr);

    return arr;
}
function preorder(root, arr=[]){
    if(!root) return;
    
    arr.push(root.data);
    preorder(root.left, arr);
    preorder(root.right, arr);

    return arr;
}
function postorder(root, arr=[]){
    if(!root) return;
    
    postorder(root.left, arr);
    postorder(root.right, arr);
    arr.push(root.data);

    return arr;
}

function height(node){
    if(!node) return -1;

    const leftHeight = height(node.left);
    const rightHeight = height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
}

function depth(root, node){
    if(!node) return -1;
    if(node===root) return 0;

    let current = root;
    let depth = 0;

    while(current !== node){
        if (node.value < current.value) current = current.left;
        else current = current.right;
        depth++;
    }
    return depth;
}

function isBalanced(root){
    if(!root) return true;

    let leftHeight = height(root.left);
    let rightHeight = height(root.right);

    if(Math.abs(leftHeight - rightHeight) > 1) return false;

    return isBalanced(root.left) && isBalanced(root.right);
}

function rebalance(root){
    const array = inorder(root);
    root = buildTree(array);

    return root;
}


//Unassociated functions
function generateRandomArray(length){
    const randomArray = [];
    for (let i = 0; i < length; i++) {
        randomArray.push(Math.floor(Math.random() * 100));
    }
    return randomArray;
}
function printArray(label, array) {
    console.log(`${label}: [${array.join(', ')}]`);
}

//Driver script 

const randomNumbers = generateRandomArray(10);
let tree = new Tree(randomNumbers);

console.log("Is Balanced (Before Unbalancing):", isBalanced(tree.root));

const inorderArray = inorder(tree.root);
const preorderArray = preorder(tree.root);
const postorderArray = postorder(tree.root);
const levelorderArray = levelOrder(tree.root);

printArray("In-Order", inorderArray);
printArray("Pre-Order", preorderArray);
printArray("Post-Order", postorderArray);
printArray("Level-Order", levelorderArray);

const unbalancedValues = generateRandomArray(100);
for (const num of unbalancedValues) {
    insert(tree.root, num);
}

console.log("Is Balanced (After Unbalancing):", isBalanced(tree.root));

const newRoot = rebalance(tree.root);

console.log("Is Balanced (After Rebalancing):", isBalanced(newRoot));


const inorderArrayRebalanced = inorder(newRoot);
const preorderArrayRebalanced = preorder(newRoot);
const postorderArrayRebalanced = postorder(newRoot);
const levelorderArrayRebalanced = levelOrder(newRoot);

printArray("In-Order (Rebalanced)", inorderArrayRebalanced);
printArray("Pre-Order (Rebalanced)", preorderArrayRebalanced);
printArray("Post-Order (Rebalanced)", postorderArrayRebalanced);
printArray("Level-Order (Rebalanced)", levelorderArrayRebalanced);

prettyPrint(newRoot);