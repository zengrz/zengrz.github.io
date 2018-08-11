---
layout: post
title:  "Deep Visual-Semantic Alignments for Generating Image Descriptions"
date:   2018-08-04 15:00:00 -0400
categories: jekyll update
---
# How Does It Work?
This algorithm[\[1\]][1] aims to first generate description of image regions by drawing correspondence between elements from the image and text spaces and connecting conceptually similar elements from the two domains into a multimodal embedding co-domain. Ideally, two conceptually similar items (eg. the word "dog" and a picture of a dog) should have identical vector representations within the embedding Hilbert space. Then, these embedded representations will be used to generate human readable description of the image.

# In Greater Detail
For the first part, neural networks are used to build such representations. Concretely, a Convolutional Neural Network (CNN) is used to build the representation for image data while a Bidirectional Recurrent Neural Network (BRNN) is used to handle the text portion of the data. The each networks is a vector, which is the representation in the embedding space. Then, the network compares the similarity of the representations by computing a image-sentence score using the dot product between the two embedding vectors. The similarity between the two corresponding concepts is directly proportional to the result of the inner product. The network learns to maximize the inner product between the two vectors produce by each network. Intuitively, the two vectors achieves maximum inner product value when the two concepts are similar, (ie. two vectors are "aligned"), and becomes increasingly negative as the angular separation reaches the maximum value π.

Next we wish to find the correspondence between descrptive word segments output by BRNN and regions on the image output by CNN. The author claims that naive approach of assigning words to highest scoring region is no viable as the words will be inconsistently assigned to regions. As a result a Markov Random Field (MRF) is used. The MRF takes outputs of the BRNN (st) and the regions output by the CNN (vi) as inputs, and holds latent variables (aj) which map from word domain (st) to image region domain (vi). The MRF is defined by an energy function, which is minimized using dynamic programming, and outputs the optimal text-to-region alignment.

Final phase of the algorithm is a multimodal, unidirectional RNN. It takes and words corresponding to the region as inputs, the representation of the corresponding region as initial hidden state, effectively conditioning the RNN on the representation of the regional content. To ensure unrestricted output length, START is introduced as the first input and last output.

# Thoughts
I think the greatest contribution of this algorithm has to be the multimodal embedding space. This idea opens a door for future networks to connect concepts from different domains using neural networks. The embedding space is proven useful as the algorithm is able to use the information from embedding space to generate the meaningful content.

# References
\[1\]: https://arxiv.org/pdf/1412.2306.pdf

[1]:https://arxiv.org/pdf/1412.2306.pdf
