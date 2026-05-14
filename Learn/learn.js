const popupContent = {
    1: {
        title: 'What Is A Multilayer Perceptron?',
        body: `<p>The multilayer perceptron is the original and simplest neural network. Its purpose is generally to make some prediction, or output, given a set of inputs. For the sake of number classification, the output will be 10 probabilities, one for each potential digit classifications (0-9), and the class with the highest probability determines the output. Because the images our MLP is attempting to classify are 28x28 in resolution, there are 784 total inputs, with one representing the shade of each pixel.</p>
               <p>A MLP is made up of many nodes, each which represent some feature, or some collection of features, about the data it has learned from. The first layer of nodes contains all of the inputs, the last layer contains all of the outputs, and there are a variable number of layers in between. Each node connects to all nodes in the layer preceding it, and each connection is assigned a weight through training. The value a node passes forward, labeled its "activation" is calculated as the weighted sum of its previous node's activations with their respective weights, added to some set bias value, and the result is passed through an activation function.</p>
               <p>In short, MLP's are extremely complex functions, with a large number of inputs. Picture a function f(x, y, z) = 5x^3 + 35y - 3z^2, which has three inputs, meaning it would be plotted in a three dimensional space. Our image classification MLP is a function with 784 inputs, meaning it would need to be plotted in a 784-dimensional space.</p>`
    },
    2: {
        title: 'Number Of Hidden Layers',
        body: `<p>The number of hidden layers refers to how many layers of nodes exist between the input layer and the output layer. A network with more hidden layers can learn increasingly abstract representations of the data, where each successive layer builds on the features extracted by the previous one. A single hidden layer might only pick up on simple edges or shading patterns, while additional layers can combine those into more complex shapes and structures.</p>
               <p>However, adding more layers is not always better. Deeper networks are harder to train, more prone to overfitting on small datasets, and take significantly longer to converge. Optimizing the number of hidden layers is important because it directly controls the complexity of what the network can learn. Too few layers and the model underfits, failing to capture the patterns in the data. Too many and it memorizes the training set without generalizing to new inputs.</p>`
    },
    3: {
        title: 'Number Of Nodes Per Layer',
        body: `<p>The number of nodes per layer, sometimes called the layer's width, determines how many individual features or combinations of features that layer can represent at once. A wider layer has more capacity to capture nuance in the data, while a narrower layer forces the network to compress information into fewer representations.</p>
               <p>For our digit classifier, the first hidden layer might need enough nodes to distinguish between different stroke patterns, while later layers might need fewer as the features become more refined. Tuning the width of each layer matters because an undersized layer creates an information bottleneck, where important details get lost as data flows through the network. An oversized layer wastes computation and, like adding too many hidden layers, increases the risk of overfitting. The goal is to find a width that gives the network enough room to learn without giving it so much room that it starts memorizing noise.</p>`
    },
    4: {
        title: 'Learning Rate',
        body: `<p>The learning rate is a scalar value that controls how much the network's weights are adjusted during each step of training. After the network makes a prediction and calculates how wrong it was, gradients are computed to determine which direction each weight should move. The learning rate scales those gradients before they are applied, essentially deciding how big of a step the network takes toward a better solution.</p>
               <p>A large learning rate means bigger steps, which can speed up training but risks overshooting the optimal weights entirely, causing the loss to bounce around or even diverge. A small learning rate takes more careful steps, but training can become painfully slow or get stuck in a poor local minimum. This is arguably the single most impactful hyperparameter to tune, because even a perfect architecture will fail to learn anything useful if the learning rate is too high or too low.</p>`
    },
    5: {
        title: 'Batch Size',
        body: `<p>The batch size determines how many training samples the network processes before updating its weights. Rather than updating after every single image or after the entire dataset, the training data is split into batches, and one weight update happens per batch. A batch size of 32 means the network sees 32 images, averages the error across all of them, and then adjusts.</p>
               <p>Smaller batches introduce more noise into the gradient estimates, which can actually help the network escape poor local minima and often leads to better generalization. Larger batches produce smoother, more stable gradients but can cause the network to converge to sharp minima that do not generalize as well to unseen data. Batch size also has a direct impact on training speed and memory usage, since larger batches can take better advantage of parallel processing on a GPU but require more memory to hold in a single pass.</p>`
    },
    6: {
        title: 'Number Of Epochs',
        body: `<p>An epoch is one complete pass through the entire training dataset. If the dataset contains 60,000 images and the batch size is 100, then one epoch consists of 600 weight updates. Training for more epochs gives the network more opportunities to refine its weights, but there is a point of diminishing returns.</p>
               <p>Early in training the loss drops quickly as the network picks up on the most obvious patterns, and then progress slows as it fine-tunes smaller details. Training for too many epochs leads to overfitting, where the network begins to memorize the specific training examples rather than learning general patterns. Training for too few epochs means the network has not had enough exposure to the data to learn anything meaningful. Selecting the right number of epochs is about finding the sweet spot where validation performance plateaus before it starts to degrade.</p>`
    },
    7: {
        title: 'Weight Initialization Method',
        body: `<p>Weight initialization defines the starting values assigned to every connection in the network before training begins. These are not random in the colloquial sense; they are drawn from carefully designed distributions. The initialization method matters because training is an iterative process that starts from these initial values, and a poor starting point can cripple the entire process. If weights start too large, activations can explode and gradients become unstable. If they start too small, activations shrink toward zero and gradients vanish, effectively preventing deeper layers from learning at all.</p>
               <p><strong>Xavier/Glorot Uniform</strong> draws weights from a uniform distribution bounded by the square root of six divided by the sum of the layer's input and output node counts. It is designed to keep the variance of activations roughly equal across layers, and works best with symmetric activation functions like sigmoid and tanh. <strong>Xavier/Glorot Normal</strong> follows the same scaling logic but draws from a normal distribution instead, which means most weights cluster near zero with occasional larger values. The normal version can sometimes converge slightly more smoothly because extreme outlier weights are less likely.</p>
               <p><strong>He Uniform</strong> is tailored specifically for ReLU activation functions, which zero out all negative inputs and therefore cut the variance of each layer's output roughly in half. He initialization compensates for this by scaling weights more aggressively, drawing from a uniform distribution bounded by the square root of six divided by only the number of input nodes. This keeps activations from shrinking to zero in deep ReLU networks where Glorot initialization would cause gradients to vanish.</p>
               <p><strong>Random Uniform</strong> draws weights from a simple uniform distribution across a fixed range, typically -0.05 to 0.05, without any scaling based on layer size. This is the most naïve approach and serves mainly as a baseline. <strong>Zero initialization</strong> sets every weight to exactly zero, which is almost never desirable because it causes every node in a layer to compute the exact same output and receive the exact same gradient update, effectively reducing each layer to a single node regardless of its width.</p>`
    },
    8: {
        title: 'Bias Initialization Method',
        body: `<p>Each node in the network has a bias term that is added to the weighted sum before the activation function is applied. The bias allows the node to shift its activation threshold, making it possible to fit data that does not pass through the origin. Bias initialization is generally less sensitive than weight initialization, but the choice still affects how quickly training gets off the ground, especially in deeper networks.</p>
               <p><strong>Zero initialization</strong> sets every bias to exactly zero, which is the most common default and works well in the vast majority of cases. Unlike weights, setting biases to zero does not cause a symmetry problem because the weights themselves are already initialized with variation, so each node still computes a unique output. The bias simply shifts that output, and the network learns the appropriate shifts during training.</p>
               <p><strong>Constant (0.01)</strong> sets every bias to a small positive value. This is sometimes used with ReLU networks specifically to ensure that nodes begin in the active region of the ReLU function. If a node's initial weighted sum happens to be negative, a zero bias means the ReLU kills its output entirely and no gradient flows back, potentially creating a "dead" node that never learns. A small positive bias nudges the sum into positive territory, giving every node a chance to contribute from the start.</p>
               <p><strong>Random Uniform</strong> draws biases from a uniform distribution over a small range. This adds a bit of asymmetry to the starting points of each node, which can occasionally help with convergence in architectures where nodes tend to behave too similarly early in training. However, it introduces a minor source of randomness that makes results slightly less reproducible, and for most standard architectures the benefit over zero initialization is negligible.</p>`
    },
};

function markClicked(id) {
    const clicked = JSON.parse(sessionStorage.getItem('clickedButtons') || '[]');
    if (!clicked.includes(id)) {
        clicked.push(id);
        sessionStorage.setItem('clickedButtons', JSON.stringify(clicked));
    }
    document.querySelectorAll('.unclicked-button, .clicked-button').forEach(btn => {
        const btnId = parseInt(btn.dataset.id);
        btn.className = clicked.includes(btnId) ? 'clicked-button' : 'unclicked-button';
    });
}

function openPopup(id) {
    markClicked(id);
    const content = popupContent[id];
    document.getElementById('popup-title').textContent = content.title;
    document.getElementById('popup-body').innerHTML = content.body;
    document.getElementById('popup-overlay').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    const clicked = JSON.parse(sessionStorage.getItem('clickedButtons') || '[]');
    document.querySelectorAll('.unclicked-button, .clicked-button').forEach(btn => {
        const btnId = parseInt(btn.dataset.id);
        if (clicked.includes(btnId)) btn.className = 'clicked-button';
    });
});

function closePopup() {
    document.getElementById('popup-overlay').style.display = 'none';
}
