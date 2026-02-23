---
layout: default
title: Projects
---

{% include nav.html %}

<a id="top"></a>

## Quick Navigation

- [SOC Analyst Home Lab](#soc-lab)
- [Active Directory Enterprise Lab](#ad-lab)
- [HTB Sherlock – Campfire Investigation](#campfire)

---
## Cybersecurity Projects

### 🛡️ SOC Analyst Home Lab
<a id="soc-lab"></a>

🔗 [Lab Repository](https://github.com/vardiomar/SOCAnalystLab)

**Situation:**
Designed a controlled lab environment to simulate real-world enterprise attack and defense scenarios.

**Task:**
Build a functional SOC environment capable of detecting, analyzing, and responding to advanced adversary techniques.

**Actions:**
- Deployed Windows and Linux virtual machines to simulate enterprise endpoints and attacker systems
- Installed and configured Sysmon to enhance endpoint telemetry collection
- Implemented LimaCharlie EDR for centralized endpoint monitoring and detection
- Generated custom C2 payloads using Sliver to emulate attacker tradecraft
- Crafted detection & response rules for credential dumping (LSASS access) and shadow copy deletion
- Integrated YARA scanning for automated malware signature detection

**Result:**
Successfully detected simulated credential dumping and destructive behavior, validated detection rules against live attack telemetry, and improved understanding of endpoint visibility and response workflows.

---

### 🏢 Active Directory Enterprise Lab
<a id="ad-lab"></a>

🔗 [Lab Repository](https://github.com/vardiomar/ADlab)

**Situation:**
Built an enterprise-scale Active Directory lab to understand identity management, domain security, and centralized logging.

**Task:**
Simulate enterprise IT infrastructure with centralized authentication, logging, and network monitoring.

**Actions:**
- Deployed Windows Server 2022 Domain Controller and configured Active Directory services
- Created user groups, applied Group Policy Objects (GPOs), and enforced least privilege access
- Deployed Splunk Enterprise with Universal Forwarders for centralized log ingestion
- Installed Security Onion with Zeek and Suricata for network intrusion detection
- Configured firewall rules and network segmentation using pfSense
- Used PowerShell automation for system configuration and policy enforcement

**Result:**
Created a scalable detection environment capable of correlating endpoint, network, and authentication logs to identify suspicious behavior and reduce security blind spots.

---
### 🔎 Hack The Box – Sherlock: Campfire Investigation (Part I & II) ![Splunk](https://img.shields.io/badge/Splunk-000000?style=flat-square&logo=splunk&logoColor=FFE019)
<a id="campfire"></a>

🔗 [Campfire Part I](https://github.com/vardiomar/HTB-Campfire-1)

🔗 [Campfire Part II](https://github.com/vardiomar/HTB-Campfire-2)

**Situation:**
Investigated a simulated enterprise security incident involving suspicious authentication activity, potential lateral movement, and compromised user accounts.

**Task:**
Analyze host, authentication, and network artifacts to determine the attack timeline, identify the initial access vector, and assess adversary impact.

**Actions:**
- Examined Windows event logs, authentication logs, and system artifacts to reconstruct attacker activity
- Identified abnormal login patterns, suspicious account behavior, and privilege escalation indicators
- Correlated timestamps across multiple log sources to establish a clear attack timeline
- Investigated lateral movement techniques and abnormal service execution
- Applied knowledge of Windows internals, process analysis, and authentication mechanisms
- Used structured investigative methodology aligned with incident response lifecycle phases

**Result:**
Successfully reconstructed the adversary timeline, identified compromised accounts and suspicious logon activity, and demonstrated the ability to perform structured forensic analysis in a simulated enterprise environment.


<p align="right"><a href="#top">⬆ Back to Top</a></p>

---
