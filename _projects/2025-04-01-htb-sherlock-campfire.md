---
title: "Hack The Box Sherlock: Campfire Investigation (Part I & II)"
description: "Reconstructed an attacker timeline from Windows event logs and authentication artifacts in a simulated enterprise incident."
date: 2025-04-01
labels: [DFIR, Splunk, Incident Response]
toc: true
---

🔗 [Campfire Part I](https://github.com/vardiomar/HTB-Campfire-1)
🔗 [Campfire Part II](https://github.com/vardiomar/HTB-Campfire-2)

## Situation

Investigated a simulated enterprise security incident involving suspicious authentication activity, potential lateral movement, and compromised user accounts.

## Task

Analyze host, authentication, and network artifacts to determine the attack timeline, identify the initial access vector, and assess adversary impact.

## Actions

- Examined Windows event logs, authentication logs, and system artifacts to reconstruct attacker activity
- Identified abnormal login patterns, suspicious account behavior, and privilege escalation indicators
- Correlated timestamps across multiple log sources to establish a clear attack timeline
- Investigated lateral movement techniques and abnormal service execution
- Applied knowledge of Windows internals, process analysis, and authentication mechanisms
- Used structured investigative methodology aligned with incident response lifecycle phases

## Result

Successfully reconstructed the adversary timeline, identified compromised accounts and suspicious logon activity, and demonstrated the ability to perform structured forensic analysis in a simulated enterprise environment.
