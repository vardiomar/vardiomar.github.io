---
title: "Active Directory Enterprise Lab"
description: "An enterprise-scale Active Directory lab with centralized logging, network monitoring and segmentation."
date: 2024-09-30
labels: [Active Directory, Splunk, Security Onion]
toc: true
---

🔗 [Lab Repository](https://github.com/vardiomar/ADlab)

## Situation

Built an enterprise-scale Active Directory lab to understand identity management, domain security, and centralized logging.

## Task

Simulate enterprise IT infrastructure with centralized authentication, logging, and network monitoring.

## Actions

- Deployed Windows Server 2022 Domain Controller and configured Active Directory services
- Created user groups, applied Group Policy Objects (GPOs), and enforced least privilege access
- Deployed Splunk Enterprise with Universal Forwarders for centralized log ingestion
- Installed Security Onion with Zeek and Suricata for network intrusion detection
- Configured firewall rules and network segmentation using pfSense
- Used PowerShell automation for system configuration and policy enforcement

## Result

Created a scalable detection environment capable of correlating endpoint, network, and authentication logs to identify suspicious behavior and reduce security blind spots.
