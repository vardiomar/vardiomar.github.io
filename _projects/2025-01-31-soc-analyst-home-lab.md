---
title: "SOC Analyst Home Lab"
description: "A controlled lab simulating enterprise attack and defense, with EDR, Sysmon, Sliver C2 and YARA-based detection."
date: 2025-01-31
labels: [SOC, EDR, Detection Engineering]
toc: true
---

🔗 [Lab Repository](https://github.com/vardiomar/SOCAnalystLab)

## Situation

Designed a controlled lab environment to simulate real-world enterprise attack and defense scenarios.

## Task

Build a functional SOC environment capable of detecting, analyzing, and responding to advanced adversary techniques.

## Actions

- Deployed Windows and Linux virtual machines to simulate enterprise endpoints and attacker systems
- Installed and configured Sysmon to enhance endpoint telemetry collection
- Implemented LimaCharlie EDR for centralized endpoint monitoring and detection
- Generated custom C2 payloads using Sliver to emulate attacker tradecraft
- Crafted detection & response rules for credential dumping (LSASS access) and shadow copy deletion
- Integrated YARA scanning for automated malware signature detection

## Result

Successfully detected simulated credential dumping and destructive behavior, validated detection rules against live attack telemetry, and improved understanding of endpoint visibility and response workflows.
