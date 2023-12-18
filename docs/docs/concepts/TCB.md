# Trusted Computing Base (TCB)
________________________________________________________

## What is the TCB?

Normally, when you run an application on a machine, you need to trust multiple elements: from the hardware of the machine you deploy your application on, to the application itself, through the operating system, hypervisor, etc. This doesn't mean we "trust" them in the everyday sense of the word- this means that our application could be affected by a bug or vulnerability in these elements! 

These trusted elements make up what we call the **Trusted Computing Base** or **TCB** of our application.

In the context of a regular AI API deployed in the Cloud, the TCB is made of: 

+ The hardware: the physical infrastructure on which everything runs. This includes the actual servers, the networking equipment, storage devices, etc. If there's a hardware vulnerability (like the well-known Meltdown or Spectre vulnerabilities that affected many modern processors), it can undermine the security of everything running on that hardware.
+ The hypervisor: it is responsible for creating, managing, and isolating virtual machines (VMs) on a single physical host. If there's a vulnerability in the hypervisor, malicious entities might escape their VM and affect other VMs on the same host. In the cloud, the hypervisor is the responsibility of the cloud provider.
+ The guest operating system: it provides the environment in which the applications run. Vulnerabilities at this level can allow unauthorized access, privilege escalation, or other malicious activities.
+ The application code and model weights of the AI: If there's a vulnerability in the server code or if someone can tamper with the model's weights, they might be able to produce undesired outputs, exfiltrate data, or crash the system.

## What is the TCB for BlindLlama?

With BlindLlama, like with a typical API set-up, we still have to trust the **Cloud provider's hardware & hypervisor**. However, we deploy an auditable OS and server code which are verified using secure hardware-based attestation, which we will learn about in [the next section](./TPMs.md).

![tcb-dark](../../assets/tcb-dark.png#only-dark)
![tcb-light](../../assets/tcb-light.png#only-light)

> Note, this is simplified as there are many more components that are part of the stack we could have included, such as the bootloader, kernel, etc.

<div style="text-align: left;">
  <a href="../hardened-systems" class="btn">Back</a>
</div>

<div style="text-align: right;">
  <a href="../TPMs" class="btn">Next</a>
</div>
