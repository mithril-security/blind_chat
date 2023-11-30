# Project & resource library

## Controlled AI Consumption Proof of Concept (POC)

We partnered up with the [Future of Life Institute](https://futureoflife.org/) to create a POC of a system which provides remotely monitorable AI, where consumption of the AI model can be controlled and tracked by a third party and where model weights are never exposed.

<iframe width="560" height="315" src="https://www.youtube.com/embed/rZFtg1phpPk?si=3jEVXDhsJUmppEae" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## StarCoder Memorization Checker

We wanted to raise awareness around how training data can be memorized by AI and then accidentally leaked as a response to other users.  

We found that open source LLM StarCoder memorized at least 8% of the training samples we used in training.

This demonstrates the very real risks to users' privacy at a time when many large-scale Conversational AI available are commercially collecting users' data at scale and fine-tuning their models on it.

![Training-data-memorization-checker-demo](TODO)

See our demo [here](https://huggingface.co/spaces/mithril-security/starcoder_memorization_checker).

Check out our HuggingFace blog post [here](https://huggingface.co/blog/dhuynh95/starcoder-memorization-experiment).

## Presentation of BlindAI to the Confidential Computing Consortium

See our Head of Cybersecurity, Corentin Lauverjat, presenting our BlindAI project in detail in the following video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/LzqSFVaN4hE?si=8lPdpHcsTPLapwQV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## PoisonGPT

We demonstrated the risks of model poisoning by demonstrating how you we could easily modify an open-source model to spread misinformation and upload it to HuggingFace while being undetected by standard benchmarks.

The aim of the project is to raise awareness of the need for safer verifiable AI.

You can find our article on the project [here](https://blog.mithrilsecurity.io/poisongpt-how-we-hid-a-lobotomized-llm-on-hugging-face-to-spread-fake-news/) or test out the live demo [here](https://huggingface.co/spaces/mithril-security/poisongpt?ref=blog.mithrilsecurity.io).

You can also check out this community reaction video!

<iframe width="560" height="315" src="https://www.youtube.com/embed/VD__vrOKobo?si=ddPsA_Hz0Ras4S1a" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>