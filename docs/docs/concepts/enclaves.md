---
description: "Understand hardened systems in data security: No special admin privileges or backdoors, securing confidential data access."
---

# Hardened systems
________________________________________________________

## What are hardened systems?

Hardened systems operate without special administrative privileges or backdoors. The underlying principle is that once a system comes into contact with confidential data, it should not be possible even for administrators to get privileged access to the system and the system should operate predictably. This is essential for achieving high-security standards, as the security of a system is only as strong as its weakest link, and it is often the humans that are the weakest link in otherwise reasonably secure systems.

Protecting data within an environment from external access and manipulation, is not a new concept, with one of the most robust examples coming in the form of [Confidential Computing's](https://www.ibm.com/topics/confidential-computing) [Trusted Execution Environments](https://www.techtarget.com/searchitoperations/definition/trusted-execution-environment-TEE).

Let's now find out more about BlindLlama's hardened environments and how we protect these environments from outside access.

## How do we create hardened environments in BlindLlama?

To ensure data security, we:

+ Modify the OS image and VM configurations to eliminate all system administrator's access. For instance, there is no SSH access to the server.
+ Limit or remove telemetry and logging that is sent to external monitoring services.

> We consider local-only logs to be safe as long as they never leave the hardened system, so there is no need to disable them.

For enhanced security, we deploy a minimal OS. The OS runs entirely in RAM rather than using the disk. This is to eliminate the risks associated with disk usage such as confidential data leakage via the filesystem and system integrity corruption.

![hardened-env-dark](../../assets/hardened-dark.png#only-dark)
![hardened-env-light](../../assets/hardened-light.png#only-light)

## Security measures and process

Before deploying a service, a full hardening and audit of the application layer is done.

A pen testing of the server is done to:

+ Have an overview of the software and its attack surface
+ Remove all the possible accesses or controls that represent a threat 

Following this, remediation of any issues found is done.

While hardening the server image, memory management is a crucial part of securing the runtime software. Strict isolation of the image is done through configuration by disabling or restricting multiple accesses.

On the network side, only the required ports will be open and used, and all the data in transit will be encrypted through the attested TLS encryption mechanism (which we discuss [in the last section this guide](./attested-tls.md)) to ensure the integrity and confidentiality of the data. Furthermore, a thorough review of the web-based APIs included is taken into account. 

Access control is also reviewed, as it is a common attack surface. If needed, we limit and restrict users and privileges.
 
Every verification that goes into delivering the hardened environment will be detailed in a deliverable that will also contain a full auditing report resulting from the pen testing and remediation actions.

<div style="text-align: left;">
  <a href="../overview" class="btn">Back</a>
</div>

<div style="text-align: right;">
  <a href="../TCB" class="btn">Next</a>
</div>