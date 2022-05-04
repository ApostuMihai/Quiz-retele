const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const photographElement = document.getElementById("photo");
const imageElement = document.getElementById("image");
const explanationElement = document.getElementById("explanation");

let shuffledQuestions, currentQuestionIndex;
let shuffledAnswers;

Array.prototype.shuffle = function () {
  var i = this.length;
  while (i) {
    var j = Math.floor(Math.random() * i);
    var t = this[--i];
    this[i] = this[j];
    this[j] = t;
  }
  return this;
};

if (!("scramble" in Array.prototype)) {
  Object.defineProperty(Array.prototype, "scramble", {
    enumerable: false,
    value: function () {
      var o,
        i,
        ln = this.length;
      while (ln--) {
        i = (Math.random() * (ln + 1)) | 0;
        o = this[ln];
        this[ln] = this[i];
        this[i] = o;
      }
      return this;
    },
  });
}

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

function startGame() {
  startButton.classList.add("hide");
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  // console.log(shuffledQuestions);
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}
function showExplanation(explanation) {
  explanationElement.innerText = `Explicatie: ${explanation.explanation}`;
  explanationElement.classList.remove("hide");
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  const scrambledQues = question.answers.scramble();
  scrambledQues.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (question.photograph) {
      photographElement.classList.remove("hide");
      imageElement.src = question.photograph;
    }

    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(document.body);
  imageElement.src = "";
  explanationElement.classList.add("hide");
  nextButton.classList.add("hide");
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  setStatusClass(document.body, correct);
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  });
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
    showExplanation(shuffledQuestions[currentQuestionIndex]);
  } else {
    startButton.innerText = "Restart";
    startButton.classList.remove("hide");
    showExplanation(shuffledQuestions[currentQuestionIndex]);
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

const questions = [
  {
    question:
      "Refer to the exhibit. What will router R1 do with a packet that has a destination IPv6 address of 2001:db8:cafe:5::1?",
    answers: [
      { text: "forward the packet out GigabitEthernet0/0", correct: false },
      { text: "drop the packet", correct: false },
      { text: "forward the packet out GigabitEthernet0/1", correct: false },
      { text: "forward the packet out Serial0/0/0", correct: true },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/Switching-Routing-and-Wireless-Essentials-Version-7.00-Final-Answers-1.png?ezimgfmt=ng%3Awebp%2Fngcb2%2Frs%3Adevice%2Frscb2-1",
    explanation:
      "The route ::/0 is the compressed form of the 0000:0000:0000:0000:0000:0000:0000:0000/0 default route. The default route is used if a more specific route is not found in the routing table.",
  },
  {
    question:
      "Refer to the exhibit. Currently router R1 uses an EIGRP route learned from Branch2 to reach the 10.10.0.0/16 network. Which floating static route would create a backup route to the 10.10.0.0/16 network in the event that the link between R1 and Branch2 goes down?",
    answers: [
      {
        text: "ip route 10.10.0.0 255.255.0.0 Serial 0/0/0 100",
        correct: false,
      },
      {
        text: "ip route 10.10.0.0 255.255.0.0 209.165.200.226 100",
        correct: false,
      },
      {
        text: "ip route 10.10.0.0 255.255.0.0 209.165.200.225 100",
        correct: true,
      },
      {
        text: "ip route 10.10.0.0 255.255.0.0 209.165.200.225 50",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/Switching-Routing-and-Wireless-Essentials-Version-7.00-Final-Answers-2.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "A floating static route needs to have an administrative distance that is greater than the administrative distance of the active route in the routing table. Router R1 is using an EIGRP route which has an administrative distance of 90 to reach the 10.10.0.0/16 network. To be a backup route the floating static route must have an administrative distance greater than 90 and have a next hop address corresponding to the serial interface IP address of Branch1.",
  },
  {
    question:
      "Refer to the exhibit. R1 was configured with the static route command ip route 209.165.200.224 255.255.255.224 S0/0/0 and consequently users on network 172.16.0.0/16 are unable to reach resources on the Internet. How should this static route be changed to allow user traffic from the LAN to reach the Internet?",
    answers: [
      { text: "Add an administrative distance of 254.", correct: false },
      {
        text: "Change the destination network and mask to 0.0.0.0 0.0.0.0",
        correct: true,
      },
      { text: "Change the exit interface to S0/0/1.", correct: false },
      {
        text: "Add the next-hop neighbor address of 209.165.200.226.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2016/02/sfdsgfdg5-1.jpg?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "The static route on R1 has been incorrectly configured with the wrong destination network and mask. The correct destination network and mask is 0.0.0.0 0.0.0.0.",
  },
  {
    question:
      "Which option shows a correctly configured IPv4 default static route?",
    answers: [
      { text: "ip route 0.0.0.0 255.255.255.0 S0/0/0", correct: false },
      {
        text: "ip route 0.0.0.0 0.0.0.0 S0/0/0",
        correct: true,
      },
      { text: "ip route 0.0.0.0 255.255.255.255 S0/0/0", correct: false },
      {
        text: "ip route 0.0.0.0 255.0.0.0 S0/0/0",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "The static route ip route 0.0.0.0 0.0.0.0 S0/0/0 is considered a default static route and will match all destination networks.",
  },
  {
    question:
      "Refer to the exhibit. Which static route command can be entered on R1 to forward traffic to the LAN connected to R2?",
    answers: [
      { text: "ipv6 route 2001:db8:12:10::/64 S0/0/0", correct: false },
      {
        text: "ipv6 route 2001:db8:12:10::/64 S0/0/1 fe80::2",
        correct: true,
      },
      { text: "ipv6 route 2001:db8:12:10::/64 S0/0/0 fe80::2", correct: false },
      {
        text: "ipv6 route 2001:db8:12:10::/64 S0/0/1 2001:db8:12:10::1",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/2020-01-31_201339-768x336-1.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question: "What is a method to launch a VLAN hopping attack?",
    answers: [
      {
        text: "introducing a rogue switch and enabling trunking",
        correct: true,
      },
      {
        text: "sending spoofed native VLAN information",
        correct: false,
      },
      {
        text: "sending spoofed IP addresses from the attacking host",
        correct: false,
      },
      {
        text: "flooding the switch with MAC addresses",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A cybersecurity analyst is using the macof tool to evaluate configurations of switches deployed in the backbone network of an organization. Which type of LAN attack is the analyst targeting during this evaluation?",
    answers: [
      {
        text: "VLAN hopping",
        correct: false,
      },
      {
        text: "DHCP spoofing",
        correct: false,
      },
      {
        text: "MAC address table overflow",
        correct: true,
      },
      {
        text: "VLAN double-tagging",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "Macof is a network attack tool and is mainly used to flood LAN switches with MAC addresses.",
  },
  {
    question:
      "Refer to the exhibit. A network administrator is configuring a router as a DHCPv6 server. The administrator issues a show ipv6 dhcp pool command to verify the configuration. Which statement explains the reason that the number of active clients is 0?",
    answers: [
      {
        text: "The default gateway address is not provided in the pool.",
        correct: false,
      },
      {
        text: "No clients have communicated with the DHCPv6 server yet.",
        correct: false,
      },
      {
        text: "The IPv6 DHCP pool configuration has no IPv6 address range specified.",
        correct: false,
      },
      {
        text: "The state is not maintained by the DHCPv6 server under stateless DHCPv6 operation.",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2016/02/i210895v1n1_210895.jpg?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "Under the stateless DHCPv6 configuration, indicated by the command ipv6 nd other-config-flag, the DHCPv6 server does not maintain the state information, because client IPv6 addresses are not managed by the DHCP server. Because the clients will configure their IPv6 addresses by combining the prefix/prefix-length and a self-generated interface ID, the ipv6 dhcp pool configuration does not need to specify the valid IPv6 address range. And because clients will use the link-local address of the router interface as the default gateway address, the default gateway address is not necessary.",
  },
  {
    question:
      "Refer to the exhibit. A network administrator configured routers R1 and R2 as part of HSRP group 1. After the routers have been reloaded, a user on Host1 complained of lack of connectivity to the Internet The network administrator issued the show standby brief command on both routers to verify the HSRP operations. In addition, the administrator observed the ARP table on Host1. Which entry should be seen in the ARP table on Host1 in order to gain connectivity to the Internet?",
    answers: [
      {
        text: "the virtual IP address and the virtual MAC address for the HSRP group 1",
        correct: true,
      },
      {
        text: "the virtual IP address of the HSRP group 1 and the MAC address of R1",
        correct: false,
      },
      {
        text: "the virtual IP address of the HSRP group 1 and the MAC address of R2",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/2020-01-31_201813-768x556-1.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "Hosts will send an ARP request to the default gateway which is the virtual IP address. ARP replies from the HSRP routers contain the virtual MAC address. The host ARP tables will contain a mapping of the virtual IP to the virtual MAC. The IP address and the MAC address of R1",
  },
  {
    question:
      "Match the forwarding characteristic to its type. (Not all options are used.)",
    answers: [
      {
        text: "N-ai variante, doar uita-te pe poza",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/CCNA-2-v7-final-exam-answers-10.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. A network administrator configured routers R1 and R2 as part of HSRP group 1. After the routers have been reloaded, a user on Host1 complained of lack of connectivity to the Internet The network administrator issued the show standby brief command on both routers to verify the HSRP operations. In addition, the administrator observed the ARP table on Host1. Which entry should be seen in the ARP table on Host1 in order to gain connectivity to the Internet?",
    answers: [
      {
        text: "the virtual IP address and the virtual MAC address for the HSRP group 1",
        correct: true,
      },
      {
        text: "the virtual IP address of the HSRP group 1 and the MAC address of R1",
        correct: false,
      },
      {
        text: "the virtual IP address of the HSRP group 1 and the MAC address of R2",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/2020-01-31_201813-768x556-1.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "Hosts will send an ARP request to the default gateway which is the virtual IP address. ARP replies from the HSRP routers contain the virtual MAC address. The host ARP tables will contain a mapping of the virtual IP to the virtual MAC. The IP address and the MAC address of R1",
  },
  {
    question:
      "Which statement is correct about how a Layer 2 switch determines how to forward frames?",
    answers: [
      {
        text: "Frame forwarding decisions are based on MAC address and port mappings in the CAM table.",
        correct: true,
      },
      {
        text: "Only frames with a broadcast destination address are forwarded out all active switch ports.",
        correct: false,
      },
      {
        text: "Cut-through frame forwarding ensures that invalid frames are always dropped.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "Cut-through frame forwarding reads up to only the first 22 bytes of a frame, which excludes the frame check sequence and thus invalid frames may be forwarded. In addition to broadcast frames, frames with a destination MAC address that is not in the CAM are also flooded out all active ports. Unicast frames are not always forwarded. Received frames with a destination MAC address that is associated with the switch port on which it is received are not forwarded because the destination exists on the network segment connected to that port.",
  },
  {
    question:
      "Which statement describes a result after multiple Cisco LAN switches are interconnected?",
    answers: [
      {
        text: "The broadcast domain expands to all switches.",
        correct: true,
      },
      {
        text: "One collision domain exists per switch.",
        correct: false,
      },
      {
        text: "There is one broadcast domain and one collision domain per switch.",
        correct: false,
      },
      {
        text: "Frame collisions increase on the segments connecting the switches.",
        correct: false,
      },
      {
        text: "Unicast frames are always forwarded regardless of the destination MAC address.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "In Cisco LAN switches, the microsegmentation makes it possible for each port to represent a separate segment and thus each switch port represents a separate collision domain. This fact will not change when multiple switches are interconnected. However, LAN switches do not filter broadcast frames. A broadcast frame is flooded to all ports. Interconnected switches form one big broadcast domain.",
  },
  {
    question:
      "Match the link state to the interface and protocol status. (Not all options are used.)",
    answers: [
      {
        text: "N-ai variante, doar uita-te pe imagine",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/CCNA-2-v7-final-exam-answers-13.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. How is a frame sent from PCA forwarded to PCC if the MAC address table on switch SW1 is empty?",
    answers: [
      {
        text: "SW1 forwards the frame directly to SW2. SW2 floods the frame to all ports connected to SW2, excluding the port through which the frame entered the switch.",
        correct: false,
      },
      {
        text: "SW1 floods the frame on all ports on the switch, excluding the interconnected port to switch SW2 and the port through which the frame entered the switch.",
        correct: false,
      },
      {
        text: "SW1 floods the frame on all ports on SW1, excluding the port through which the frame entered the switch.",
        correct: true,
      },
      {
        text: "SW1 drops the frame because it does not know the destination MAC address.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/2020-01-31_202702.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "When a switch powers on, the MAC address table is empty. The switch builds the MAC address table by examining the source MAC address of incoming frames. The switch forwards based on the destination MAC address found in the frame header. If a switch has no entries in the MAC address table or if the destination MAC address is not in the switch table, the switch will forward the frame out all ports except the port that brought the frame into the switch.",
  },
  {
    question:
      "An administrator is trying to remove configurations from a switch. After using the command erase startup-config and reloading the switch, the administrator finds that VLANs 10 and 100 still exist on the switch. Why were these VLANs not removed?",
    answers: [
      {
        text: "Because these VLANs are stored in a file that is called vlan.dat that is located in flash memory, this file must be manually deleted.",
        correct: true,
      },
      {
        text: "These VLANs cannot be deleted unless the switch is in VTP client mode.",
        correct: false,
      },
      {
        text: "These VLANs are default VLANs that cannot be removed.",
        correct: false,
      },
      {
        text: "These VLANs can only be removed from the switch by using the no vlan 10 and no vlan 100 commands.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "Explanation: Standard range VLANs (1-1005) are stored in a file that is called vlan.dat that is located in flash memory. Erasing the startup configuration and reloading a switch does not automatically remove these VLANs. The vlan.dat file must be manually deleted from flash memory and then the switch must be reloaded.",
  },
  {
    question:
      "Match the description to the correct VLAN type. (Not all options are used.)",
    answers: [
      {
        text: "N-ai variante, doar uita-te la poza",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/CCNA-2-v7-final-exam-answers-16.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "A data VLAN is configured to carry user-generated traffic. A default VLAN is the VLAN where all switch ports belong after the initial boot up of a switch loading the default configuration. A native VLAN is assigned to an 802.1Q trunk port, and untagged traffic is placed on it. A management VLAN is any VLAN that is configured to access the management capabilities of a switch. An IP address and subnet mask are assigned to it, allowing the switch to be managed via HTTP, Telnet, SSH, or SNMP.",
  },
  {
    question:
      "Refer to the exhibit. A network administrator has connected two switches together using EtherChannel technology. If STP is running, what will be the end result?",
    answers: [
      {
        text: "STP will block one of the redundant links.",
        correct: true,
      },
      {
        text: "The switches will load balance and utilize both EtherChannels to forward packets.",
        correct: false,
      },
      {
        text: "The resulting loop will create a broadcast storm.",
        correct: false,
      },
      {
        text: "Both port channels will shutdown.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/Switching-Routing-and-Wireless-Essentials-Version-7.00-Final-Answers-9.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "Cisco switches support two protocols for negotiating a channel between two switches: LACP and PAgP. PAgP is Cisco-proprietary. In the topology shown, the switches are connected to each other using redundant links. By default, STP is enabled on switch devices. STP will block redundant links to prevent loops.",
  },
  {
    question:
      "What is a secure configuration option for remote access to a network device?",
    answers: [
      {
        text: "Configure an ACL and apply it to the VTY lines.",
        correct: false,
      },
      {
        text: "Configure 802.1x.",
        correct: false,
      },
      {
        text: "Configure SSH.",
        correct: true,
      },
      {
        text: "Configure Telnet.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question: "Which wireless encryption method is the most secure?",
    answers: [
      {
        text: "WPA2 with AES",
        correct: true,
      },
      {
        text: "WPA2 with TKIP",
        correct: false,
      },
      {
        text: "WEP",
        correct: false,
      },
      {
        text: "WPA",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "After attaching four PCs to the switch ports, configuring the SSID and setting authentication properties for a small office network, a technician successfully tests the connectivity of all PCs that are connected to the switch and WLAN. A firewall is then configured on the device prior to connecting it to the Internet. What type of network device includes all of the described features?",
    answers: [
      {
        text: "firewall appliance",
        correct: false,
      },
      {
        text: "wireless router",
        correct: true,
      },
      {
        text: "switch",
        correct: false,
      },
      {
        text: "standalone wireless access point",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. Host A has sent a packet to host B. What will be the source MAC and IP addresses on the packet when it arrives at host B?",
    answers: [
      {
        text: "Source MAC: 00E0.FE91.7799\n Source IP: 10.1.1.10",
        correct: true,
      },
      {
        text: "Source MAC: 00E0.FE10.17A3\n Source IP: 10.1.1.10",
        correct: false,
      },
      {
        text: "Source MAC: 00E0.FE10.17A3\n Source IP: 192.168.1.1",
        correct: false,
      },
      {
        text: "Source MAC: 00E0.FE91.7799\n Source IP: 10.1.1.1",
        correct: false,
      },
      {
        text: "Source MAC: 00E0.FE91.7799\n Source IP: 192.168.1.1",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2016/02/p39-prac-final-ccna2.jpg?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "As a packet traverses the network, the Layer 2 addresses will change at every hop as the packet is de-encapsulated and re-encapsulated, but the Layer 3 addresses will remain the same.",
  },
  {
    question:
      "Refer to the exhibit. In addition to static routes directing traffic to networks 10.10.0.0/16 and 10.20.0.0/16, Router HQ is also configured with the following command: ip route 0.0.0.0 0.0.0.0 serial 0/1/1. \n What is the purpose of this command?",
    answers: [
      {
        text: "Packets that are received from the Internet will be forwarded to one of the LANs connected to R1 or R2.",
        correct: false,
      },
      {
        text: "Packets with a destination network that is not 10.10.0.0/16 or is not 10.20.0.0/16 or is not a directly connected network will be forwarded to the Internet.",
        correct: true,
      },
      {
        text: "Packets from the 10.10.0.0/16 network will be forwarded to network 10.20.0.0/16, and packets from the 10.20.0.0/16 network will be forwarded to network 10.10.0.0/16.",
        correct: false,
      },
      {
        text: "Packets that are destined for networks that are not in the routing table of HQ will be dropped.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/2020-01-31_203919-768x465-1.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "What protocol or technology disables redundant paths to eliminate Layer 2 loops?",
    answers: [
      {
        text: "VTP",
        correct: false,
      },
      {
        text: "STP",
        correct: true,
      },
      {
        text: "EtherChannel",
        correct: false,
      },
      {
        text: "DTP",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. Based on the exhibited configuration and output, why is VLAN 99 missing?",
    answers: [
      {
        text: "because VLAN 99 is not a valid management VLAN",
        correct: false,
      },
      {
        text: "because there is a cabling problem on VLAN 99",
        correct: false,
      },
      {
        text: "because VLAN 1 is up and there can only be one management VLAN on the switch",
        correct: false,
      },
      {
        text: "because VLAN 99 has not yet been created",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/rx4-768x474-1.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "Which two VTP modes allow for the creation, modification, and deletion of VLANs on the local switch? (Choose two.)",
    answers: [
      {
        text: "client",
        correct: false,
      },
      {
        text: "master",
        correct: false,
      },
      {
        text: "distribution",
        correct: false,
      },
      {
        text: "slave",
        correct: false,
      },
      {
        text: "server",
        correct: true,
      },
      {
        text: "transparent",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Which three steps should be taken before moving a Cisco switch to a new VTP management domain? (Choose three.)",
    answers: [
      {
        text: "Configure the switch with the name of the new management domain.",
        correct: true,
      },
      {
        text: "Reset the VTP counters to allow the switch to synchronize with the other switches in the domain.",
        correct: false,
      },
      {
        text: "Configure the VTP server in the domain to recognize the BID of the new switch.",
        correct: false,
      },
      {
        text: "Download the VTP database from the VTP server in the new domain.",
        correct: false,
      },
      {
        text: "Select the correct VTP mode and version.",
        correct: true,
      },
      {
        text: "Reboot the switch.",
        correct: true,
      },
    ],
    photograph: "",
    explanation:
      "When adding a new switch to a VTP domain, it is critical to configure the switch with a new domain name, the correct VTP mode, VTP version number, and password. A switch with a higher revision number can propagate invalid VLANs and erase valid VLANs thus preventing connectivity for multiple devices on the valid VLANs.",
  },
  {
    question:
      "A network administrator is preparing the implementation of Rapid PVST+ on a production network. How are the Rapid PVST+ link types determined on the switch interfaces?",
    answers: [
      {
        text: "Link types can only be configured on access ports configured with a single VLAN.",
        correct: false,
      },
      {
        text: "Link types can only be determined if PortFast has been configured.",
        correct: false,
      },
      {
        text: "Link types are determined automatically.",
        correct: true,
      },
      {
        text: "Link types must be configured with specific port configuration commands.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "When Rapid PVST+ is being implemented, link types are automatically determined but can be specified manually. Link types can be either point-to-point, shared, or edge.",
  },
  {
    question:
      "Refer to the exhibit. All the displayed switches are Cisco 2960 switches with the same default priority and operating at the same bandwidth. Which three ports will be STP designated ports? (Choose three.)",
    answers: [
      {
        text: "fa0/9",
        correct: false,
      },
      {
        text: "fa0/13",
        correct: true,
      },
      {
        text: "fa0/10",
        correct: true,
      },
      {
        text: "fa0/20",
        correct: false,
      },
      {
        text: "fa0/21",
        correct: true,
      },
      {
        text: "fa0/11",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/rx5.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "How will a router handle static routing differently if Cisco Express Forwarding is disabled?",
    answers: [
      {
        text: "It will not perform recursive lookups.",
        correct: false,
      },
      {
        text: "Ethernet multiaccess interfaces will require fully specified static routes to avoid routing inconsistencies.",
        correct: true,
      },
      {
        text: "Static routes that use an exit interface will be unnecessary.",
        correct: false,
      },
      {
        text: "Serial point-to-point interfaces will require fully specified static routes to avoid routing inconsistencies.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "In most platforms running IOS 12.0 or later, Cisco Express Forwarding is enabled by default. Cisco Express Forwarding eliminates the need for the recursive lookup. If Cisco Express Forwarding is disabled, multiaccess network interfaces require fully specified static routes in order to avoid inconsistencies in their routing tables. Point-to-point interfaces do not have this problem, because multiple end points are not present. With or without Cisco Express Forwarding enabled, using an exit interface when configuring a static route is a viable option.",
  },
  {
    question:
      "Compared with dynamic routes, what are two advantages of using static routes on a router? (Choose two.)",
    answers: [
      {
        text: "They improve netw​ork security.",
        correct: true,
      },
      {
        text: "They take less time to converge when the network topology changes.",
        correct: false,
      },
      {
        text: "They improve the efficiency of discovering neighboring networks.",
        correct: false,
      },
      {
        text: "They use fewer router resources.",
        correct: true,
      },
    ],
    photograph: "",
    explanation:
      "Static routes are manually configured on a router. Static routes are not automatically updated and must be manually reconfigured if the network topology changes. Thus static routing improves network security because it does not make route updates among neighboring routers. Static routes also improve resource efficiency by using less bandwidth, and no CPU cycles are used to calculate and communicate routes.",
  },
  {
    question:
      "Refer to the exhibit. Which route was configured as a static route to a specific network using the next-hop address?",
    answers: [
      {
        text: "S 10.17.2.0/24 [1/0] via 10.16.2.2",
        correct: true,
      },
      {
        text: "S 0.0.0.0/0 [1/0] via 10.16.2.2",
        correct: false,
      },
      {
        text: "S 10.17.2.0/24 is directly connected, Serial 0/0/0",
        correct: false,
      },
      {
        text: "C 10.16.2.0/24 is directly connected, Serial0/0/0",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/rx6.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "The C in a routing table indicates an interface that is up and has an IP address assigned. The S in a routing table signifies that a route was installed using the ip route command. Two of the routing table entries shown are static routes to a specific destination (the 192.168.2.0 network). The entry that has the S denoting a static route and [1/0] was configured using the next-hop address. The other entry (S 192.168.2.0/24 is directly connected, Serial 0/0/0) is a static route configured using the exit interface. The entry with the 0.0.0.0 route is a default static route which is used to send packets to any destination network that is not specifically listed in the routing table.",
  },
  {
    question:
      "What is the effect of entering the spanning-tree portfast configuration command on a switch?",
    answers: [
      {
        text: "It disables an unused port.",
        correct: false,
      },
      {
        text: "It disables all trunk ports.",
        correct: false,
      },
      {
        text: "It enables portfast on a specific switch interface.",
        correct: true,
      },
      {
        text: "It checks the source L2 address in the Ethernet header against the sender L2 address in the ARP body.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question: "What is the IPv6 prefix that is used for link-local addresses?",
    answers: [
      {
        text: "FF01::/8",
        correct: false,
      },
      {
        text: "2001::/3",
        correct: false,
      },
      {
        text: "FC00::/7",
        correct: false,
      },
      {
        text: "FE80::/10",
        correct: true,
      },
    ],
    photograph: "",
    explanation:
      "The IPv6 link-local prefix is FE80::/10 and is used to create a link-local IPv6 address on an interface.",
  },
  {
    question:
      "Which two statements are characteristics of routed ports on a multilayer switch? (Choose two.)​",
    answers: [
      {
        text: "In a switched network, they are mostly configured between switches at the core and distribution layers.",
        correct: true,
      },
      {
        text: "The interface vlan command has to be entered to create a VLAN on routed ports.",
        correct: false,
      },
      {
        text: "They support subinterfaces, like interfaces on the Cisco IOS routers.",
        correct: false,
      },
      {
        text: "They are used for point-to-multipoint links.",
        correct: false,
      },
      {
        text: "They are not associated with a particular VLAN.",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Successful inter-VLAN routing has been operating on a network with multiple VLANs across multiple switches for some time. When an inter-switch trunk link fails and Spanning Tree Protocol brings up a backup trunk link, it is reported that hosts on two VLANs can access some, but not all the network resources that could be accessed previously. Hosts on all other VLANS do not have this problem. What is the most likely cause of this problem?",
    answers: [
      {
        text: "The protected edge port function on the backup trunk interfaces has been disabled.",
        correct: true,
      },
      {
        text: "The allowed VLANs on the backup link were not configured correctly.",
        correct: false,
      },
      {
        text: "Dynamic Trunking Protocol on the link has failed.",
        correct: false,
      },
      {
        text: "Inter-VLAN routing also failed when the trunk link failed.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Which command will start the process to bundle two physical interfaces to create an EtherChannel group via LACP?",
    answers: [
      {
        text: "interface port-channel 2",
        correct: false,
      },
      {
        text: "channel-group 1 mode desirable",
        correct: false,
      },
      {
        text: "interface range GigabitEthernet 0/4 - 5",
        correct: true,
      },
      {
        text: "channel-group 2 mode auto",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What action takes place when a frame entering a switch has a multicast destination MAC address?",
    answers: [
      {
        text: "The switch will forward the frame out all ports except the incoming port.",
        correct: true,
      },
      {
        text: "The switch forwards the frame out of the specified port.",
        correct: false,
      },
      {
        text: "The switch adds a MAC address table entry mapping for the destination MAC address and the ingress port.",
        correct: false,
      },
      {
        text: "The switch replaces the old entry and uses the more current port.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "If the destination MAC address is a broadcast or a multicast, the frame is also flooded out all ports except the incoming port.",
  },
  {
    question:
      "A junior technician was adding a route to a LAN router. A traceroute to a device on the new network revealed a wrong path and unreachable status. What should be done or checked?",
    answers: [
      {
        text: "Verify that there is not a default route in any of the edge router routing tables.",
        correct: false,
      },
      {
        text: "Check the configuration on the floating static route and adjust the AD.",
        correct: false,
      },
      {
        text: "Create a floating static route to that network.",
        correct: false,
      },
      {
        text: "Check the configuration of the exit interface on the new static route.",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Select the three PAgP channel establishment modes. (Choose three.)",
    answers: [
      {
        text: "auto",
        correct: true,
      },
      {
        text: "default",
        correct: false,
      },
      {
        text: "passive",
        correct: false,
      },
      {
        text: "desirable",
        correct: true,
      },
      {
        text: "extended",
        correct: false,
      },
      {
        text: "on",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A static route has been configured on a router. However, the destination network no longer exists. What should an administrator do to remove the static route from the routing table?",
    answers: [
      {
        text: "Remove the route using the no ip route command.",
        correct: true,
      },
      {
        text: "Change the administrative distance for that route.",
        correct: false,
      },
      {
        text: "Change the routing metric for that route.",
        correct: false,
      },
      {
        text: "Nothing. The static route will go away on its own.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "When the destination network specified in a static route does not exist anymore, the static route stays in the routing table until it is manually removed by using the no ip route command.",
  },
  {
    question:
      "Refer to the exhibit. What can be concluded about the configuration shown on R1?",
    answers: [
      {
        text: "R1 is configured as a DHCPv4 relay agent.",
        correct: true,
      },
      {
        text: "R1 is operating as a DHCPv4 server.",
        correct: false,
      },
      {
        text: "R1 will broadcast DHCPv4 requests on behalf of local DHCPv4 clients.",
        correct: false,
      },
      {
        text: "R1 will send a message to a local DHCPv4 client to contact a DHCPv4 server at 10.10.10.8.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/rx7.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "Match the step to each switch boot sequence description. (Not all options are used.)",
    answers: [
      {
        text: "N-ai variante, uita-te la poza",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/2021-11-15_105846-ans.jpg?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "The steps are:\n 1. execute POST\n 2. load the boot loader from ROM\n 3. CPU register initializations\n 4. flash file system initialization\n 5. load the IOS\n 6. transfer switch control to the IOS",
  },
  {
    question:
      "Refer to the exhibit. R1 has been configured as shown. However, PC1 is not able to receive an IPv4 address. What is the problem?",
    answers: [
      {
        text: "The ip helper-address command was applied on the wrong interface.",
        correct: true,
      },
      {
        text: "R1 is not configured as a DHCPv4 server.​",
        correct: false,
      },
      {
        text: "A DHCP server must be installed on the same LAN as the host that is receiving the IP address.",
        correct: false,
      },
      {
        text: "The ip address dhcp command was not issued on the interface Gi0/1.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/rx9.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "The ip helper-address command has to be applied on interface Gi0/0. This command must be present on the interface of the LAN that contains the DHCPv4 client PC1 and must be directed to the correct DHCPv4 server.",
  },
  {
    question:
      "What two default wireless router settings can affect network security? (Choose two.)",
    answers: [
      {
        text: "The SSID is broadcast.",
        correct: true,
      },
      {
        text: "MAC address filtering is enabled.",
        correct: false,
      },
      {
        text: "WEP encryption is enabled.",
        correct: false,
      },
      {
        text: "The wireless channel is automatically selected.",
        correct: false,
      },
      {
        text: "A well-known administrator password is set.",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/i232273v1n1_232273.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "Default settings on wireless routers often include broadcasting the SSID and using a well-known administrative password. Both of these pose a security risk to wireless networks. WEP encryption and MAC address filtering are not set by default. The automatic selection of the wireless channel poses no security risks.",
  },
  {
    question:
      "What is the common term given to SNMP log messages that are generated by network devices and sent to the SNMP server?",
    answers: [
      {
        text: "traps",
        correct: true,
      },
      {
        text: "acknowledgments",
        correct: false,
      },
      {
        text: "auditing",
        correct: false,
      },
      {
        text: "warnings",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A network administrator is adding a new WLAN on a Cisco 3500 series WLC. Which tab should the administrator use to create a new VLAN interface to be used for the new WLAN?",
    answers: [
      {
        text: "WIRELESS",
        correct: false,
      },
      {
        text: "MANAGEMENT",
        correct: false,
      },
      {
        text: "CONTROLLER",
        correct: true,
      },
      {
        text: "WLANs",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A network administrator is configuring a WLAN. Why would the administrator change the default DHCP IPv4 addresses on an AP?",
    answers: [
      {
        text: "to restrict access to the WLAN by authorized, authenticated users only",
        correct: false,
      },
      {
        text: "to monitor the operation of the wireless network",
        correct: false,
      },
      {
        text: "to reduce outsiders intercepting data or accessing the wireless network by using a well-known address range",
        correct: true,
      },
      {
        text: "to reduce the risk of interference by external devices such as microwave ovens",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Which two functions are performed by a WLC when using split media access control (MAC)? (Choose two.)",
    answers: [
      {
        text: "packet acknowledgments and retransmissions",
        correct: false,
      },
      {
        text: "frame queuing and packet prioritization",
        correct: false,
      },
      {
        text: "beacons and probe responses",
        correct: false,
      },
      {
        text: "frame translation to other protocols",
        correct: true,
      },
      {
        text: "association and re-association of roaming clients",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "On what switch ports should BPDU guard be enabled to enhance STP stability?",
    answers: [
      {
        text: "all PortFast-enabled ports",
        correct: true,
      },
      {
        text: "only ports that are elected as designated ports",
        correct: false,
      },
      {
        text: "only ports that attach to a neighboring switch",
        correct: false,
      },
      {
        text: "all trunk ports that are not root ports",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question: "Which network attack is mitigated by enabling BPDU guard?",
    answers: [
      {
        text: "rogue switches on a network",
        correct: true,
      },
      {
        text: "CAM table overflow attacks",
        correct: false,
      },
      {
        text: "MAC address spoofing",
        correct: false,
      },
      {
        text: "rogue DHCP servers on a network",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "There are several recommended STP stability mechanisms to help mitigate STP manipulation attacks:\n PortFast - used to immediately bring an interface configured as an access or trunk port to the forwarding state from a blocking state. Applied to all end-user ports.\n BPDU guard - immediately error-disables a port that receives a BPDU. Applied to all end-user ports.The receipt of BPDUs may be part of an unauthorized attempt to add a switch to the network.\n Root guard - prevents a switch from becoming the root switch. Applied to all ports where the root switch should not be located.\n Loop guard - detects unidirectional links to prevent alternate or root ports from becoming designated ports. Applied to all ports that are or can become nondesignated.",
  },
  {
    question:
      "Why is DHCP snooping required when using the Dynamic ARP Inspection feature?",
    answers: [
      {
        text: "It relies on the settings of trusted and untrusted ports set by DHCP snooping.",
        correct: false,
      },
      {
        text: "It uses the MAC address table to verify the default gateway IP address.",
        correct: false,
      },
      {
        text: "It redirects ARP requests to the DHCP server for verification.",
        correct: false,
      },
      {
        text: "It uses the MAC-address-to-IP-address binding database to validate an ARP packet.",
        correct: true,
      },
    ],
    photograph: "",
    explanation:
      "DAI relies on DHCP snooping. DHCP snooping listens to DHCP message exchanges and builds a bindings database of valid tuples (MAC address, IP address, VLAN interface).\n When DAI is enabled, the switch drops ARP packet if the sender MAC address and sender IP address do not match an entry in the DHCP snooping bindings database. However, it can be overcome through static mappings. Static mappings are useful when hosts configure static IP addresses, DHCP snooping cannot be run, or other switches in the network do not run dynamic ARP inspection. A static mapping associates an IP address to a MAC address on a VLAN.",
  },
  {
    question:
      "Refer to the exhibit. Router R1 has an OSPF neighbor relationship with the ISP router over the 192.168.0.32 network. The 192.168.0.36 network link should serve as a backup when the OSPF link goes down. The floating static route command ip route 0.0.0.0 0.0.0.0 S0/0/1 100 was issued on R1 and now traffic is using the backup link even when the OSPF link is up and functioning. Which change should be made to the static route command so that traffic will only use the OSPF link when it is up?",
    answers: [
      {
        text: "Change the administrative distance to 120.",
        correct: true,
      },
      {
        text: "Add the next hop neighbor address of 192.168.0.36.",
        correct: false,
      },
      {
        text: "Change the destination network to 192.168.0.34.",
        correct: false,
      },
      {
        text: "Change the administrative distance to 1.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2016/02/i210868v1n2_210868.gif",
    explanation:
      "The problem with the current floating static route is that the administrative distance is set too low. The administrative distance will need to be higher than that of OSPF, which is 110, so that the router will only use the OSPF link when it is up.",
  },
  {
    question:
      "Refer to the exhibit. What is the metric to forward a data packet with the IPv6 destination address 2001:DB8:ACAD:E:240:BFF:FED4:9DD2?",
    answers: [
      {
        text: "90",
        correct: false,
      },
      {
        text: "128",
        correct: false,
      },
      {
        text: "2170112",
        correct: false,
      },
      {
        text: "2681856",
        correct: false,
      },
      {
        text: "2682112",
        correct: true,
      },
      {
        text: "3193856",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/CCNA-2-v7-exam-answers.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "The IPv6 destination address 2001:DB8:ACAD:E:240:BFF:FED4:9DD2 belongs to the network of 2001:DB8:ACAD:E::/64. In the routing table, the route to forward the packet has Serial 0/0/1 as an exit interface and 2682112 as the cost.",
  },
  {
    question:
      "A network administrator is configuring a new Cisco switch for remote management access. Which three items must be configured on the switch for the task? (Choose three.)",
    answers: [
      {
        text: "IP address",
        correct: true,
      },
      {
        text: "VTP domain",
        correct: false,
      },
      {
        text: "vty lines",
        correct: true,
      },
      {
        text: "default VLAN",
        correct: false,
      },
      {
        text: "default gateway",
        correct: true,
      },
      {
        text: "loopback address",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "To enable the remote management access, the Cisco switch must be configured with an IP address and a default gateway. In addition, vty lines must configured to enable either Telnet or SSH connections. A loopback address, default VLAN, and VTP domain configurations are not necessary for the purpose of remote switch management.",
  },
  {
    question:
      "Refer to the exhibit. Which statement shown in the output allows router R1 to respond to stateless DHCPv6 requests?",
    answers: [
      {
        text: "ipv6 nd other-config-flag",
        correct: true,
      },
      {
        text: "prefix-delegation 2001:DB8:8::/48 00030001000E84244E70",
        correct: false,
      },
      {
        text: "ipv6 dhcp server LAN1​",
        correct: false,
      },
      {
        text: "ipv6 unicast-routing",
        correct: false,
      },
      {
        text: "dns-server 2001:DB8:8::8​",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/CCNA-2-v7-exam-answers-56.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "The interface command ipv6 nd other-config-flag allows RA messages to be sent on this interface, indicating that additional information is available from a stateless DHCPv6 server.",
  },
  {
    question:
      "Refer to the exhibit. A Layer 3 switch routes for three VLANs and connects to a router for Internet connectivity. Which two configurations would be applied to the switch? (Choose two.)",
    answers: [
      {
        text: "(config)# interface gigabitethernet1/1\n(config-if)# switchport mode trunk",
        correct: false,
      },
      {
        text: "(config)# interface gigabitethernet 1/1\n(config-if)# no switchport\n(config-if)# ip address 192.168.1.2 255.255.255.252",
        correct: true,
      },
      {
        text: "(config)# interface vlan 1\n(config-if)# ip address 192.168.1.2 255.255.255.0\n(config-if)# no shutdown",
        correct: false,
      },
      {
        text: "(config)# interface fastethernet0/4\n(config-if)# switchport mode trunk",
        correct: false,
      },
      {
        text: "(config)# ip routing",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A technician is troubleshooting a slow WLAN and decides to use the split-the-traffic approach. Which two parameters would have to be configured to do this? (Choose two.)",
    answers: [
      {
        text: "Configure the 5 GHz band for streaming multimedia and time sensitive traffic.",
        correct: true,
      },
      {
        text: "Configure the security mode to WPA Personal TKIP/AES for one network and WPA2 Personal AES for the other network",
        correct: false,
      },
      {
        text: "Configure the 2.4 GHz band for basic internet traffic that is not time sensitive.",
        correct: true,
      },
      {
        text: "Configure the security mode to WPA Personal TKIP/AES for both networks.",
        correct: false,
      },
      {
        text: "Configure a common SSID for both split networks.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A company has just switched to a new ISP. The ISP has completed and checked the connection from its site to the company. However, employees at the company are not able to access the internet. What should be done or checked?",
    answers: [
      {
        text: "Verify that the static route to the server is present in the routing table.",
        correct: false,
      },
      {
        text: "Check the configuration on the floating static route and adjust the AD.",
        correct: false,
      },
      {
        text: "Ensure that the old default route has been removed from the company edge routers.",
        correct: true,
      },
      {
        text: "Create a floating static route to that network.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Which information does a switch use to populate the MAC address table?",
    answers: [
      {
        text: "the destination MAC address and the incoming port",
        correct: false,
      },
      {
        text: "the destination MAC address and the outgoing port",
        correct: false,
      },
      {
        text: "the source and destination MAC addresses and the incoming port",
        correct: false,
      },
      {
        text: "the source and destination MAC addresses and the outgoing port",
        correct: false,
      },
      {
        text: "the source MAC address and the incoming port",
        correct: true,
      },
      {
        text: "the source MAC address and the outgoing port",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "To maintain the MAC address table, the switch uses the source MAC address of the incoming packets and the port that the packets enter. The destination address is used to select the outgoing port.",
  },
  {
    question:
      "Refer to the exhibit. A network administrator is reviewing the configuration of switch S1. Which protocol has been implemented to group multiple physical ports into one logical link?",
    answers: [
      {
        text: "PAgP",
        correct: true,
      },
      {
        text: "DTP",
        correct: false,
      },
      {
        text: "LACP",
        correct: false,
      },
      {
        text: "STP",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2017/03/p23-1.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "Which type of static route is configured with a greater administrative distance to provide a backup route to a route learned from a dynamic routing protocol?",
    answers: [
      {
        text: "floating static route",
        correct: true,
      },
      {
        text: "default static route",
        correct: false,
      },
      {
        text: "summary static route",
        correct: false,
      },
      {
        text: "standard static route",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "There are four basic types of static routes. Floating static routes are backup routes that are placed into the routing table if a primary route is lost. A summary static route aggregates several routes into one, reducing the of the routing table. Standard static routes are manually entered routes into the routing table. Default static routes create a gateway of last resort.",
  },
  {
    question:
      "What action takes place when a frame entering a switch has a unicast destination MAC address appearing in the MAC address table?",
    answers: [
      {
        text: "The switch updates the refresh timer for the entry.",
        correct: false,
      },
      {
        text: "The switch forwards the frame out of the specified port.",
        correct: true,
      },
      {
        text: "The switch purges the entire MAC address table.",
        correct: false,
      },
      {
        text: "The switch replaces the old entry and uses the more current port.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "The exhibit shows two PCs called PC A and PC B, two routes called R1 and R2, and two switches. PC A has the address 172.16.1.1/24 and is connected to a switch and into an interface on R1 that has the IP address 172.16.1.254. PC B has the address 172.16.2.1/24 and is connected to a switch that is connected to another interface on R1 with the IP address 172.16.2.254. The serial interface on R1 has the address 172.16.3.1 and is connected to the serial interface on R2 that has the address 172.16.3.2/24. R2 is connected to the internet cloud. Which command will create a static route on R2 in order to reach PC B?",
    answers: [
      {
        text: "R2(config)# ip route 172.16.2.1 255.255.255.0 172.16.3.1",
        correct: false,
      },
      {
        text: "R2(config)# ip route 172.16.2.0 255.255.255.0 172.16.2.254",
        correct: false,
      },
      {
        text: "R2(config)# ip route 172.16.2.0 255.255.255.0 172.16.3.1",
        correct: true,
      },
      {
        text: "R2(config)# ip route 172.16.3.0 255.255.255.0 172.16.2.254",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "The correct syntax is:\nrouter(config)# ip route destination-network destination-mask {next-hop-ip-address | exit-interface}\nIf the local exit interface instead of the next-hop IP address is used then the route will be displayed as a directly connected route instead of a static route in the routing table. Because the network to be reached is 172.16.2.0 and the next-hop IP address is 172.16.3.1, the command is R2(config)# ip route 172.16.2.0 255.255.255.0 172.16.3.1",
  },
  {
    question:
      "What protocol or technology allows data to transmit over redundant switch links?",
    answers: [
      {
        text: "EtherChannel",
        correct: false,
      },
      {
        text: "DTP",
        correct: false,
      },
      {
        text: "STP",
        correct: true,
      },
      {
        text: "VTP",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. Which three hosts will receive ARP requests from host A, assuming that port Fa0/4 on both switches is configured to carry traffic for multiple VLANs? (Choose three.)",
    answers: [
      {
        text: "host B",
        correct: false,
      },
      {
        text: "host C",
        correct: true,
      },
      {
        text: "host D",
        correct: true,
      },
      {
        text: "host E",
        correct: false,
      },
      {
        text: "host F",
        correct: true,
      },
      {
        text: "host G",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2017/06/46.jpg?ezimgfmt=rs:585x342/rscb2/ng:webp/ngcb2",
    explanation:
      "ARP requests are sent out as broadcasts. That means the ARP request is sent only throughout a specific VLAN. VLAN 1 hosts will only hear ARP requests from hosts on VLAN 1. VLAN 2 hosts will only hear ARP requests from hosts on VLAN 2.",
  },
  {
    question:
      "Refer to the exhibit. The network administrator configures both switches as displayed. However, host C is unable to ping host D and host E is unable to ping host F. What action should the administrator take to enable this communication?",
    answers: [
      {
        text: "Associate hosts A and B with VLAN 10 instead of VLAN 1.",
        correct: false,
      },
      {
        text: "Configure either trunk port in the dynamic desirable mode.",
        correct: true,
      },
      {
        text: "Include a router in the topology.",
        correct: false,
      },
      {
        text: "Remove the native VLAN from the trunk.",
        correct: false,
      },
      {
        text: "Add the switchport nonegotiate command to the configuration of SW2.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2017/03/hinh5.png?ezimgfmt=rs:593x329/rscb2/ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "What is the effect of entering the shutdown configuration command on a switch?",
    answers: [
      {
        text: "It enables BPDU guard on a specific port.",
        correct: false,
      },
      {
        text: "It disables an unused port.",
        correct: true,
      },
      {
        text: "It enables portfast on a specific switch interface.",
        correct: false,
      },
      {
        text: "It disables DTP on a non-trunking interface.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What would be the primary reason an attacker would launch a MAC address overflow attack?",
    answers: [
      {
        text: "so that the switch stops forwarding traffic",
        correct: false,
      },
      {
        text: "so that legitimate hosts cannot obtain a MAC address",
        correct: false,
      },
      {
        text: "so that the attacker can see frames that are destined for other hosts",
        correct: true,
      },
      {
        text: "so that the attacker can execute arbitrary code on the switch",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question: "During the AAA process, when will authorization be implemented?",
    answers: [
      {
        text: "Immediately after successful authentication against an AAA data source",
        correct: true,
      },
      {
        text: "Immediately after AAA accounting and auditing receives detailed reports",
        correct: false,
      },
      {
        text: "Immediately after an AAA client sends authentication information to a centralized server",
        correct: false,
      },
      {
        text: "Immediately after the determination of which resources a user can access",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "A. AAA authorization is implemented immediately after the user is authenticated against a specific AAA data source.",
  },
  {
    question:
      "A company security policy requires that all MAC addressing be dynamically learned and added to both the MAC address table and the running configuration on each switch. Which port security configuration will accomplish this?",
    answers: [
      {
        text: "auto secure MAC addresses",
        correct: false,
      },
      {
        text: "dynamic secure MAC addresses",
        correct: false,
      },
      {
        text: "static secure MAC addresses",
        correct: false,
      },
      {
        text: "sticky secure MAC addresses",
        correct: true,
      },
    ],
    photograph: "",
    explanation:
      "With sticky secure MAC addressing, the MAC addresses can be either dynamically learned or manually configured and then stored in the address table and added to the running configuration file. In contrast, dynamic secure MAC addressing provides for dynamically learned MAC addressing that is stored only in the address table.",
  },
  {
    question:
      "Which three Wi-Fi standards operate in the 2.4GHz range of frequencies? (Choose three.)",
    answers: [
      {
        text: "802.11a",
        correct: false,
      },
      {
        text: "802.11b",
        correct: true,
      },
      {
        text: "802.11g",
        correct: true,
      },
      {
        text: "802.11n",
        correct: true,
      },
      {
        text: "802.11ac",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "To obtain an overview of the spanning tree status of a switched network, a network engineer issues the show spanning-tree command on a switch. Which two items of information will this command display? (Choose two.)",
    answers: [
      {
        text: "The root bridge BID.",
        correct: true,
      },
      {
        text: "The role of the ports in all VLANs.",
        correct: true,
      },
      {
        text: "The status of native VLAN ports.",
        correct: false,
      },
      {
        text: "The number of broadcasts received on each root port.",
        correct: false,
      },
      {
        text: "The IP address of the management VLAN interface.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. Which trunk link will not forward any traffic after the root bridge election process is complete?",
    answers: [
      {
        text: "Trunk1",
        correct: false,
      },
      {
        text: "Trunk2",
        correct: true,
      },
      {
        text: "Trunk3",
        correct: false,
      },
      {
        text: "Trunk4",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2016/02/i223534v1n1_223534.jpg?ezimgfmt=rs:499x382/rscb2/ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "Which method of IPv6 prefix assignment relies on the prefix contained in RA messages?",
    answers: [
      {
        text: "EUI-64",
        correct: false,
      },
      {
        text: "SLAAC",
        correct: true,
      },
      {
        text: "static",
        correct: false,
      },
      {
        text: "stateful DHCPv6",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Which two protocols are used to provide server-based AAA authentication? (Choose two.)",
    answers: [
      {
        text: "802.1x",
        correct: false,
      },
      {
        text: "SSH",
        correct: false,
      },
      {
        text: "SNMP",
        correct: false,
      },
      {
        text: "TACACS+",
        correct: true,
      },
      {
        text: "RADIUS",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A network administrator is configuring a WLAN. Why would the administrator disable the broadcast feature for the SSID?",
    answers: [
      {
        text: "to eliminate outsiders scanning for available SSIDs in the area",
        correct: true,
      },
      {
        text: "to reduce the risk of interference by external devices such as microwave ovens",
        correct: false,
      },
      {
        text: "to reduce the risk of unauthorized APs being added to the network",
        correct: false,
      },
      {
        text: "to provide privacy and integrity to wireless traffic by using encryption",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Which mitigation technique would prevent rogue servers from providing false IP configuration parameters to clients?",
    answers: [
      {
        text: "implementing port security",
        correct: false,
      },
      {
        text: "turning on DHCP snooping",
        correct: true,
      },
      {
        text: "disabling CDP on edge ports",
        correct: false,
      },
      {
        text: "implementing port-security on edge ports",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "Like Dynamic ARP Inspection (DAI), IP Source Guard (IPSG) needs to determine the validity of MAC-address-to-IP-address bindings. To do this IPSG uses the bindings database built by DHCP snooping.",
  },
  {
    question:
      "A network administrator configures the port security feature on a switch. The security policy specifies that each access port should allow up to two MAC addresses. When the maximum number of MAC addresses is reached, a frame with the unknown source MAC address is dropped and a notification is sent to the syslog server. Which security violation mode should be configured for each access port?",
    answers: [
      {
        text: "shutdown",
        correct: false,
      },
      {
        text: "restrict",
        correct: true,
      },
      {
        text: "warning",
        correct: false,
      },
      {
        text: "protect",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What protocol or technology defines a group of routers, one of them defined as active and another one as standby?",
    answers: [
      {
        text: "EtherChannel",
        correct: false,
      },
      {
        text: "VTP",
        correct: false,
      },
      {
        text: "HSRP",
        correct: true,
      },
      {
        text: "DTP",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. After attempting to enter the configuration that is shown in router RTA, an administrator receives an error and users on VLAN 20 report that they are unable to reach users on VLAN 30. What is causing the problem?",
    answers: [
      {
        text: "There is no address on Fa0/0 to use as a default gateway.",
        correct: false,
      },
      {
        text: "RTA is using the same subnet for VLAN 20 and VLAN 30.",
        correct: true,
      },
      {
        text: "Dot1q does not support subinterfaces.",
        correct: false,
      },
      {
        text: "The no shutdown command should have been issued on Fa0/0.20 and Fa0/0.30.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2016/02/sdsfr43f.jpg?ezimgfmt=rs:504x213/rscb2/ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "Which three pairs of trunking modes will establish a functional trunk link between two Cisco switches? (Choose three.)",
    answers: [
      {
        text: "dynamic desirable - dynamic desirable",
        correct: true,
      },
      {
        text: "dynamic desirable - trunk",
        correct: true,
      },
      {
        text: "dynamic auto - dynamic auto",
        correct: false,
      },
      {
        text: "access - dynamic auto",
        correct: false,
      },
      {
        text: "dynamic desirable - dynamic auto",
        correct: true,
      },
      {
        text: "access - trunk",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A technician is configuring a router for a small company with multiple WLANs and doesn’t need the complexity of a dynamic routing protocol. What should be done or checked?",
    answers: [
      {
        text: "Verify that there is not a default route in any of the edge router routing tables.",
        correct: false,
      },
      {
        text: "Create static routes to all internal networks and a default route to the internet.",
        correct: true,
      },
      {
        text: "Create extra static routes to the same location with an AD of 1.",
        correct: false,
      },
      {
        text: "Check the statistics on the default route for oversaturation.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A company is deploying a wireless network in the distribution facility in a Boston suburb. The warehouse is quite large and it requires multiple access points to be used. Because some of the company devices still operate at 2.4GHz, the network administrator decides to deploy the 802.11g standard. Which channel assignments on the multiple access points will make sure that the wireless channels are not overlapping?",
    answers: [
      {
        text: "channels 1, 5, and 9",
        correct: false,
      },
      {
        text: "channels 1, 6, and 11",
        correct: true,
      },
      {
        text: "channels 1, 7, and 13",
        correct: false,
      },
      {
        text: "channels 2, 6, and 10",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "In the North America domain, 11 channels are allowed for 2.4GHz wireless networking. Among these 11 channels, the combination of channels 1, 6, and 11 are the only non-overlapping channel combination.",
  },
  {
    question:
      "A network administrator of a small advertising company is configuring WLAN security by using the WPA2 PSK method. Which credential do office users need in order to connect their laptops to the WLAN?",
    answers: [
      {
        text: "the company username and password through Active Directory service",
        correct: false,
      },
      {
        text: "a key that matches the key on the AP",
        correct: false,
      },
      {
        text: "a user passphrase",
        correct: true,
      },
      {
        text: "a username and password configured on the AP",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. What are the possible port roles for ports A, B, C, and D in this RSTP-enabled network?",
    answers: [
      {
        text: "alternate, designated, root, root",
        correct: true,
      },
      {
        text: "designated, alternate, root, root",
        correct: false,
      },
      {
        text: "alternate, root, designated, root",
        correct: false,
      },
      {
        text: "designated, root, alternate, root",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/CCNA-2-v7-Modules-5-6-Redundant-Networks-Exam.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "Because S1 is the root bridge, B is a designated port, and C and D root ports. RSTP supports a new port type, alternate port in discarding state, that can be port A in this scenario.",
  },
  {
    question:
      "Refer to the exhibit. Which static route would an IT technician enter to create a backup route to the 172.16.1.0 network that is only used if the primary RIP learned route fails?",
    answers: [
      {
        text: "ip route 172.16.1.0 255.255.255.0 s0/0/0",
        correct: false,
      },
      {
        text: "ip route 172.16.1.0 255.255.255.0 s0/0/0 121",
        correct: true,
      },
      {
        text: "ip route 172.16.1.0 255.255.255.0 s0/0/0 111",
        correct: false,
      },
      {
        text: "ip route 172.16.1.0 255.255.255.0 s0/0/0 91",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/i282902v1n1_Routing3-1.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "A backup static route is called a floating static route. A floating static route has an administrative distance greater than the administrative distance of another static route or dynamic route.",
  },
  {
    question:
      "What mitigation plan is best for thwarting a DoS attack that is creating a MAC address table overflow?",
    answers: [
      {
        text: "Disable DTP.",
        correct: false,
      },
      {
        text: "Disable STP.",
        correct: false,
      },
      {
        text: "Enable port security.",
        correct: true,
      },
      {
        text: "Place unused ports in an unused VLAN.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "A MAC address (CAM) table overflow attack, buffer overflow, and MAC address spoofing can all be mitigated by configuring port security. A network administrator would typically not want to disable STP because it prevents Layer 2 loops. DTP is disabled to prevent VLAN hopping. Placing unused ports in an unused VLAN prevents unauthorized wired connectivity.",
  },
  {
    question:
      "A network engineer is troubleshooting a newly deployed wireless network that is using the latest 802.11 standards. When users access high bandwidth services such as streaming video, the wireless network performance is poor. To improve performance the network engineer decides to configure a 5 Ghz frequency band SSID and train users to use that SSID for streaming media services. Why might this solution improve the wireless network performance for that type of service?",
    answers: [
      {
        text: "Requiring the users to switch to the 5 GHz band for streaming media is inconvenient and will result in fewer users accessing these services.",
        correct: false,
      },
      {
        text: "The 5 GHz band has more channels and is less crowded than the 2.4 GHz band, which makes it more suited to streaming multimedia.",
        correct: true,
      },
      {
        text: "The 5 GHz band has a greater range and is therefore likely to be interference-free.",
        correct: false,
      },
      {
        text: "The only users that can switch to the 5 GHz band will be those with the latest wireless NICs, which will reduce usage.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "Wireless range is determined by the access point antenna and output power, not the frequency band that is used. In this scenario it is stated that all users have wireless NICs that comply with the latest standard, and so all can access the 5 GHz band. Although some users may find it inconvenient to switch to the 5 Ghz band to access streaming services, it is the greater number of channels, not just fewer users, that will improve network performance.",
  },
  {
    question:
      "Which DHCPv4 message will a client send to accept an IPv4 address that is offered by a DHCP server?",
    answers: [
      {
        text: "broadcast DHCPACK",
        correct: false,
      },
      {
        text: "broadcast DHCPREQUEST",
        correct: true,
      },
      {
        text: "unicast DHCPACK",
        correct: false,
      },
      {
        text: "unicast DHCPREQUEST",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "When a DHCP client receives DHCPOFFER messages, it will send a broadcast DHCPREQUEST message for two purposes. First, it indicates to the offering DHCP server that it would like to accept the offer and bind the IP address. Second, it notifies any other responding DHCP servers that their offers are declined.",
  },
  {
    question:
      "Refer to the exhibit. Which destination MAC address is used when frames are sent from the workstation to the default gateway?",
    answers: [
      {
        text: "MAC address of the virtual router",
        correct: true,
      },
      {
        text: "MAC address of the standby router",
        correct: false,
      },
      {
        text: "MAC addresses of both the forwarding and standby routers",
        correct: false,
      },
      {
        text: "MAC address of the forwarding router",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "The IP address of the virtual router acts as the default gateway for all the workstations. Therefore, the MAC address that is returned by the Address Resolution Protocol to the workstation will be the MAC address of the virtual router.",
  },
  {
    question:
      "After a host has generated an IPv6 address by using the DHCPv6 or SLAAC process, how does the host verify that the address is unique and therefore usable?",
    answers: [
      {
        text: "The host sends an ICMPv6 echo request message to the DHCPv6 or SLAAC-learned address and if no reply is returned, the address is considered unique.",
        correct: false,
      },
      {
        text: "The host sends an ICMPv6 neighbor solicitation message to the DHCP or SLAAC-learned address and if no neighbor advertisement is returned, the address is considered unique.",
        correct: true,
      },
      {
        text: "The host checks the local neighbor cache for the learned address and if the address is not cached, it it considered unique.",
        correct: false,
      },
      {
        text: "The host sends an ARP broadcast to the local link and if no hosts send a reply, the address is considered unique.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "Before a host can actually configure and use an IPv6 address learned through SLAAC or DHCP, the host must verify that no other host is already using that address. To verify that the address is indeed unique, the host sends an ICMPv6 neighbor solicitation to the address. If no neighbor advertisement is returned, the host considers the address to be unique and configures it on the interface.",
  },
  {
    question:
      "Match the purpose with its DHCP message type. (Not all options are used.)",
    answers: [
      {
        text: "N-ai variante aici, uita-te la poza",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/2020-01-20_232028.jpg?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question: "Which protocol adds security to remote connections?",
    answers: [
      {
        text: "FTP",
        correct: false,
      },
      {
        text: "HTTP",
        correct: false,
      },
      {
        text: "NetBEUI",
        correct: false,
      },
      {
        text: "POP",
        correct: false,
      },
      {
        text: "SSH",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. A network administrator is verifying the configuration of inter-VLAN routing. Users complain that PC2 cannot communicate with PC1. Based on the output, what is the possible cause of the problem?",
    answers: [
      {
        text: "Gi0/0 is not configured as a trunk port.",
        correct: false,
      },
      {
        text: "The command interface GigabitEthernet0/0.5 was entered incorrectly.",
        correct: false,
      },
      {
        text: "There is no IP address configured on the interface Gi0/0.",
        correct: false,
      },
      {
        text: "The no shutdown command is not entered on subinterfaces.",
        correct: false,
      },
      {
        text: "The encapsulation dot1Q 5 command contains the wrong VLAN.",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/CCNA2-v7-Modules-1-4-Switching-Concepts-VLANs-and-InterVLAN-Routing-Exam-Answers-44.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. A network administrator is configuring inter-VLAN routing on a network. For now, only one VLAN is being used, but more will be added soon. What is the missing parameter that is shown as the highlighted question mark in the graphic?",
    answers: [
      {
        text: "It identifies the subinterface",
        correct: false,
      },
      {
        text: "It identifies the VLAN number.",
        correct: true,
      },
      {
        text: "It identifies the native VLAN number.",
        correct: false,
      },
      {
        text: "It identifies the type of encapsulation that is used.",
        correct: false,
      },
      {
        text: "It identifies the number of hosts that are allowed on the interface.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/CCNA2-v7-Modules-1-4-Switching-Concepts-VLANs-and-InterVLAN-Routing-Exam-Answers-74.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "Match each DHCP message type with its description. (Not all options are used.)",
    answers: [
      {
        text: "N-ai variante, uita-te la poza.",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2019/12/2020-01-20_225135.jpg?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "Place the options in the following order:\na client initiating a message to find a DHCP server - DHCPDISCOVER\na DHCP server responding to the initial request by a client - DHCPOFFER\nthe client accepting the IP address provided by the DHCP server - DHCPREQUEST\nthe DHCP server confirming that the lease has been accepted - DHCPACK",
  },
  {
    question:
      "What network attack seeks to create a DoS for clients by preventing them from being able to obtain a DHCP lease?",
    answers: [
      {
        text: "IP address spoofing",
        correct: false,
      },
      {
        text: "DHCP starvation",
        correct: true,
      },
      {
        text: "CAM table attack",
        correct: false,
      },
      {
        text: "DHCP spoofing",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "DCHP starvation attacks are launched by an attacker with the intent to create a DoS for DHCP clients. To accomplish this goal, the attacker uses a tool that sends many DHCPDISCOVER messages in order to lease the entire pool of available IP addresses, thus denying them to legitimate hosts.",
  },
  {
    question:
      "Refer to the exhibit. If the IP addresses of the default gateway router and the DNS server are correct, what is the configuration problem?",
    answers: [
      {
        text: "The DNS server and the default gateway router should be in the same subnet.",
        correct: false,
      },
      {
        text: "The IP address of the default gateway router is not contained in the excluded address list.",
        correct: true,
      },
      {
        text: "The default-router and dns-server commands need to be configured with subnet masks.",
        correct: false,
      },
      {
        text: "The IP address of the DNS server is not contained in the excluded address list.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2016/02/the-IP-addresses-of-the-default-gateway-router-and-the-DNS-server-are-correct-what-is-the-configuration-pr.png?ezimgfmt=rs:593x176/rscb2/ng:webp/ngcb2",
    explanation:
      "In this configuration, the excluded address list should include the address that is assigned to the default gateway router. So the command should be ip dhcp excluded-address 192.168.10.1 192.168.10.9.",
  },
  {
    question:
      "Refer to the exhibit. A network administrator has added a new subnet to the network and needs hosts on that subnet to receive IPv4 addresses from the DHCPv4 server.\nWhat two commands will allow hosts on the new subnet to receive addresses from the DHCP4 server? (Choose two.)",
    answers: [
      {
        text: "R1(config-if)# ip helper-address 10.2.0.250",
        correct: true,
      },
      {
        text: "R1(config)# interface G0/1",
        correct: false,
      },
      {
        text: "R1(config)# interface G0/0",
        correct: true,
      },
      {
        text: "R2(config-if)# ip helper-address 10.2.0.250",
        correct: false,
      },
      {
        text: "R2(config)# interface G0/0",
        correct: false,
      },
      {
        text: "R1(config-if)# ip helper-address 10.1.0.254",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2017/07/2017-07-05_183851-1.jpg?ezimgfmt=rs:547x291/rscb2/ng:webp/ngcb2",
    explanation:
      "You need the router interface that is connected to the new subnet and the dhcp server address.\nThe ip helper-address command is used to configure a router to be a DHCPv4 relay. The command should be placed on the interface facing the DHCPv4 clients. When the command is applied on the router interface, the interface will receive DHCPv4 broadcast messages and forward them as unicast to the IP address of the DHCPv4 server.",
  },
  {
    question:
      "What protocol or technology uses source IP to destination IP as a load-balancing mechanism?",
    answers: [
      {
        text: "VTP",
        correct: false,
      },
      {
        text: "EtherChannel",
        correct: true,
      },
      {
        text: "DTP",
        correct: false,
      },
      {
        text: "STP",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question: "What protocol should be disabled to help mitigate VLAN attacks?",
    answers: [
      {
        text: "CDP",
        correct: false,
      },
      {
        text: "ARP",
        correct: false,
      },
      {
        text: "STP",
        correct: false,
      },
      {
        text: "DTP",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What protocol or technology requires switches to be in server mode or client mode?",
    answers: [
      {
        text: "EtherChannel",
        correct: false,
      },
      {
        text: "STP",
        correct: false,
      },
      {
        text: "VTP",
        correct: true,
      },
      {
        text: "DTP",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What are two reasons a network administrator would segment a network with a Layer 2 switch? (Choose two.)",
    answers: [
      {
        text: "to create fewer collision domains",
        correct: false,
      },
      {
        text: "to enhance user bandwidth",
        correct: true,
      },
      {
        text: "to create more broadcast domains",
        correct: false,
      },
      {
        text: "to eliminate virtual circuits",
        correct: false,
      },
      {
        text: "to isolate traffic between segments",
        correct: true,
      },
      {
        text: "to isolate ARP request messages from the rest of the network",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "A switch has the ability of creating temporary point-to-point connections between the directly-attached transmitting and receiving network devices. The two devices have full-bandwidth full-duplex connectivity during the transmission.",
  },
  {
    question:
      "What command will enable a router to begin sending messages that allow it to configure a link-local address without using an IPv6 DHCP server?",
    answers: [
      {
        text: "a static route",
        correct: false,
      },
      {
        text: "the ipv6 route ::/0 command",
        correct: false,
      },
      {
        text: "the ipv6 unicast-routing command",
        correct: true,
      },
      {
        text: "the ip routing command",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "To enable IPv6 on a router you must use the ipv6 unicast-routing global configuration command or use the ipv6 enable interface configuration command. This is equivalent to entering ip routing to enable IPv4 routing on a router when it has been turned off. Keep in mind that IPv4 is enabled on a router by default. IPv6 is not enabled by default.",
  },
  {
    question:
      "A network administrator is using the router-on-a-stick model to configure a switch and a router for inter-VLAN routing. What configuration should be made on the switch port that connects to the router?",
    answers: [
      {
        text: "Configure it as a trunk port and allow only untagged traffic.",
        correct: false,
      },
      {
        text: "Configure the port as an access port and a member of VLAN1.",
        correct: false,
      },
      {
        text: "Configure the port as an 802.1q trunk port.",
        correct: true,
      },
      {
        text: "Configure the port as a trunk port and assign it to VLAN1.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "The port on the switch that connects to the router interface should be configured as a trunk port. Once it becomes a trunk port, it does not belong to any particular VLAN and will forward traffic from various VLANs.",
  },
  {
    question:
      "What are three techniques for mitigating VLAN attacks? (Choose three.)",
    answers: [
      {
        text: "Use private VLANs.",
        correct: false,
      },
      {
        text: "Enable BPDU guard.",
        correct: false,
      },
      {
        text: "Enable trunking manually",
        correct: true,
      },
      {
        text: "Enable Source Guard.",
        correct: false,
      },
      {
        text: "Disable DTP.",
        correct: true,
      },
      {
        text: "Set the native VLAN to an unused VLAN.",
        correct: true,
      },
    ],
    photograph: "",
    explanation:
      "Mitigating a VLAN attack can be done by disabling Dynamic Trunking Protocol (DTP), manually setting ports to trunking mode, and by setting the native VLAN of trunk links to VLANs not in use.",
  },
  {
    question:
      "Match the DHCP message types to the order of the DHCPv4 process. (Not all options are used.)",
    answers: [
      {
        text: "N-ai variante, doar uita-te la poza",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/2021-11-16_223240.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "The broadcast DHCPDISCOVER message finds DHCPv4 servers on the network. When the DHCPv4 server receives a DHCPDISCOVER message, it reserves an available IPv4 address to lease to the client and sends the unicast DHCPOFFER message to the requesting client. When the client receives the DHCPOFFER from the server, it sends back a DHCPREQUEST. On receiving the DHCPREQUEST message the server replies with a unicast DHCPACK message. DHCPREPLY and DHCPINFORMATION-REQUEST are DHCPv6 messages.",
  },
  {
    question:
      "In which situation would a technician use the show interfaces switch command?",
    answers: [
      {
        text: "to determine if remote access is enabled",
        correct: false,
      },
      {
        text: "when packets are being dropped from a particular directly attached host",
        correct: true,
      },
      {
        text: "when an end device can reach local devices, but not remote devices",
        correct: false,
      },
      {
        text: "to determine the MAC address of a directly attached network device on a particular interface",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "The show interfaces command is useful to detect media errors, to see if packets are being sent and received, and to determine if any runts, giants, CRCs, interface resets, or other errors have occurred. Problems with reachability to a remote network would likely be caused by a misconfigured default gateway or other routing issue, not a switch issue. The show mac address-table command shows the MAC address of a directly attached device.",
  },
  {
    question:
      "What is a drawback of the local database method of securing device access that can be solved by using AAA with centralized servers?",
    answers: [
      {
        text: "There is no ability to provide accountability.",
        correct: false,
      },
      {
        text: "User accounts must be configured locally on each device, which is an unscalable authentication solution.",
        correct: true,
      },
      {
        text: "It is very susceptible to brute-force attacks because there is no username.",
        correct: false,
      },
      {
        text: "The passwords can only be stored in plain text in the running configuration.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "The local database method of securing device access utilizes usernames and passwords that are configured locally on the router. This allows administrators to keep track of who logged in to the device and when. The passwords can also be encrypted in the configuration. However, the account information must be configured on each device where that account should have access, making this solution very difficult to scale.",
  },
  {
    question:
      "What action does a DHCPv4 client take if it receives more than one DHCPOFFER from multiple DHCP servers? ",
    answers: [
      {
        text: "It sends a DHCPREQUEST that identifies which lease offer the client is accepting.",
        correct: true,
      },
      {
        text: "It sends a DHCPNAK and begins the DHCP process over again.",
        correct: false,
      },
      {
        text: "It discards both offers and sends a new DHCPDISCOVER.",
        correct: false,
      },
      {
        text: "It accepts both DHCPOFFER messages and sends a DHCPACK.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. The network administrator is configuring the port security feature on switch SWC. The administrator issued the command show port-security interface fa 0/2 to verify the configuration. What can be concluded from the output that is shown? (Choose three.)",
    answers: [
      {
        text: "Three security violations have been detected on this interface.",
        correct: false,
      },
      {
        text: "This port is currently up.",
        correct: true,
      },
      {
        text: "The port is configured as a trunk link.",
        correct: false,
      },
      {
        text: "Security violations will cause this port to shut down immediately.",
        correct: true,
      },
      {
        text: "There is no device currently connected to this port.",
        correct: false,
      },
      {
        text: "The switch port mode for this interface is access mode.",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2016/02/Q53.jpg?ezimgfmt=rs:592x333/rscb2/ng:webp/ngcb2",
    explanation:
      "Because the security violation count is at 0, no violation has occurred. The system shows that 3 MAC addresses are allowed on port fa0/2, but only one has been configured and no sticky MAC addresses have been learned. The port is up because of the port status of secure-up. The violation mode is what happens when an unauthorized device is attached to the port. A port must be in access mode in order to activate and use port security.",
  },
  {
    question:
      "What method of wireless authentication is dependent on a RADIUS authentication server?",
    answers: [
      {
        text: "WEP",
        correct: false,
      },
      {
        text: "WPA Personal",
        correct: false,
      },
      {
        text: "WPA2 Personal",
        correct: false,
      },
      {
        text: "WPA2 Enterprise",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A network administrator has found a user sending a double-tagged 802.1Q frame to a switch. What is the best solution to prevent this type of attack?",
    answers: [
      {
        text: "The native VLAN number used on any trunk should be one of the active data VLANs.",
        correct: false,
      },
      {
        text: "The VLANs for user access ports should be different VLANs than any native VLANs used on trunk ports.",
        correct: true,
      },
      {
        text: "Trunk ports should be configured with port security.",
        correct: false,
      },
      {
        text: "Trunk ports should use the default VLAN as the native VLAN number.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. Which two conclusions can be drawn from the output? (Choose two.)",
    answers: [
      {
        text: "The EtherChannel is down.",
        correct: true,
      },
      {
        text: "The port channel ID is 2.",
        correct: true,
      },
      {
        text: "The port channel is a Layer 3 channel.",
        correct: false,
      },
      {
        text: "The bundle is fully operational.",
        correct: false,
      },
      {
        text: "The load-balancing method used is source port to destination port.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2017/03/i221267v1n1_item2.jpg?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "Match the step number to the sequence of stages that occur during the HSRP failover process. (Not all options are used.)",
    answers: [
      {
        text: "N-ai variante, uita-te la poza",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/2020-04-28_074010.jpg?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "Hot Standby Router Protocol (HSRP) is a Cisco-proprietary protocol that is designed to allow for transparent failover of a first-hop IPv4 device.",
  },
  {
    question:
      "On a Cisco 3504 WLC Summary page ( Advanced > Summary ), which tab allows a network administrator to configure a particular WLAN with a WPA2 policy?",
    answers: [
      {
        text: "WLANs",
        correct: true,
      },
      {
        text: "SECURITY",
        correct: false,
      },
      {
        text: "WIRELESS",
        correct: false,
      },
      {
        text: "MANAGEMENT",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "The WLANs tab in the Cisco 3504 WLC advanced Summary page allows a user to access the configuration of WLANs including security, QoS, and policy-mapping.",
  },
  {
    question:
      "Refer to the exhibit. A network engineer is configuring IPv6 routing on the network. Which command issued on router HQ will configure a default route to the Internet to forward packets to an IPv6 destination network that is not listed in the routing table?",
    answers: [
      {
        text: "ipv6 route ::/0 serial 0/0/0",
        correct: false,
      },
      {
        text: "ip route 0.0.0.0 0.0.0.0 serial 0/1/1",
        correct: false,
      },
      {
        text: "ipv6 route ::1/0 serial 0/1/1",
        correct: false,
      },
      {
        text: "ipv6 route ::/0 serial 0/1/1",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/2020-04-28_073221.jpg?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "Users are complaining of sporadic access to the internet every afternoon. What should be done or checked?",
    answers: [
      {
        text: "Create static routes to all internal networks and a default route to the internet.",
        correct: false,
      },
      {
        text: "Verify that there is not a default route in any of the edge router routing tables.",
        correct: false,
      },
      {
        text: "Create a floating static route to that network.",
        correct: false,
      },
      {
        text: "Check the statistics on the default route for oversaturation.",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What action takes place when the source MAC address of a frame entering a switch appears in the MAC address table associated with a different port?",
    answers: [
      {
        text: "The switch purges the entire MAC address table.",
        correct: false,
      },
      {
        text: "The switch replaces the old entry and uses the more current port.",
        correct: true,
      },
      {
        text: "The switch updates the refresh timer for the entry.",
        correct: false,
      },
      {
        text: "The switch forwards the frame out of the specified port.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A network administrator is configuring a WLAN. Why would the administrator use a WLAN controller?",
    answers: [
      {
        text: "to centralize management of multiple WLANs",
        correct: false,
      },
      {
        text: "to provide privacy and integrity to wireless traffic by using encryption",
        correct: false,
      },
      {
        text: "to facilitate group configuration and management of multiple WLANs through a WLC",
        correct: true,
      },
      {
        text: "to provide prioritized service for time-sensitive applications",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Which three statements accurately describe duplex and speed settings on Cisco 2960 switches? (Choose three.)",
    answers: [
      {
        text: "An autonegotiation failure can result in connectivity issues.",
        correct: true,
      },
      {
        text: "When the speed is set to 1000 Mb/s, the switch ports will operate in full-duplex mode.",
        correct: true,
      },
      {
        text: "The duplex and speed settings of each switch port can be manually configured.",
        correct: true,
      },
      {
        text: "Enabling autonegotiation on a hub will prevent mismatched port speeds when connecting the hub to the switch.",
        correct: false,
      },
      {
        text: "By default, the speed is set to 100 Mb/s and the duplex mode is set to autonegotiation.",
        correct: false,
      },
      {
        text: "By default, the autonegotiation feature is disabled.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. A network administrator configures R1 for inter-VLAN routing between VLAN 10 and VLAN 20. However, the devices in VLAN 10 and VLAN 20 cannot communicate. Based on the configuration in the exhibit, what is a possible cause for the problem?",
    answers: [
      {
        text: "A. The port Gi0/0 should be configured as trunk port.",
        correct: false,
      },
      {
        text: "B. The encapsulation is misconfigured on a subinterface.",
        correct: false,
      },
      {
        text: "C. A no shutdown command should be added in each subinterface configuration.",
        correct: false,
      },
      {
        text: "D. The command interface gigabitEthernet 0/0.1 is wrong.",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/2021-12-19_221231.jpg?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "A network administrator uses the spanning-tree portfast bpduguard default global configuration command to enable BPDU guard on a switch. However, BPDU guard is not activated on all access ports. What is the cause of the issue?",
    answers: [
      {
        text: "BPDU guard needs to be activated in the interface configuration command mode.",
        correct: false,
      },
      {
        text: "Access ports configured with root guard cannot be configured with BPDU guard.",
        correct: false,
      },
      {
        text: "Access ports belong to different VLANs.",
        correct: false,
      },
      {
        text: "PortFast is not configured on all access ports.",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Which two types of spanning tree protocols can cause suboptimal traffic flows because they assume only one spanning-tree instance for the entire bridged network? (Choose two.)",
    answers: [
      {
        text: "MSTP",
        correct: false,
      },
      {
        text: "RSTP",
        correct: true,
      },
      {
        text: "Rapid PVST+",
        correct: false,
      },
      {
        text: "PVST+",
        correct: false,
      },
      {
        text: "STP",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. A network administrator is configuring the router R1 for IPv6 address assignment. Based on the partial configuration, which IPv6 global unicast address assignment scheme does the administrator intend to implement?",
    answers: [
      {
        text: "stateful",
        correct: true,
      },
      {
        text: "stateless",
        correct: false,
      },
      {
        text: "manual configuration",
        correct: false,
      },
      {
        text: "SLAAC",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/i282171v1n1_282171.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "A WLAN engineer deploys a WLC and five wireless APs using the CAPWAP protocol with the DTLS feature to secure the control plane of the network devices. While testing the wireless network, the WLAN engineer notices that data traffic is being exchanged between the WLC and the APs in plain-text and is not being encrypted. What is the most likely reason for this?",
    answers: [
      {
        text: "DTLS only provides data security through authentication and does not provide encryption for data moving between a wireless LAN controller (WLC) and an access point (AP).",
        correct: false,
      },
      {
        text: "Although DTLS is enabled by default to secure the CAPWAP control channel, it is disabled by default for the data channel.",
        correct: true,
      },
      {
        text: "DTLS is a protocol that only provides security between the access point (AP) and the wireless client.",
        correct: false,
      },
      {
        text: "Data encryption requires a DTLS license to be installed on each access point (AP) prior to being enabled on the wireless LAN controller (WLC).",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "DTLS is a protocol which provides security between the AP and the WLC. It allows them to communicate using encryption and prevents eavesdropping or tampering.\nDTLS is enabled by default to secure the CAPWAP control channel but is disabled by default for the data channel. All CAPWAP management and control traffic exchanged between an AP and WLC is encrypted and secured by default to provide control plane privacy and prevent Man-In-the-Middle (MITM) attacks.",
  },
  {
    question:
      "A new switch is to be added to an existing network in a remote office. The network administrator does not want the technicians in the remote office to be able to add new VLANs to the switch, but the switch should receive VLAN updates from the VTP domain. Which two steps must be performed to configure VTP on the new switch to meet these conditions? (Choose two.)",
    answers: [
      {
        text: "Configure the new switch as a VTP client.",
        correct: true,
      },
      {
        text: "Configure the existing VTP domain name on the new switch.",
        correct: true,
      },
      {
        text: "Configure an IP address on the new switch.",
        correct: false,
      },
      {
        text: "Configure all ports of both switches to access mode.",
        correct: false,
      },
      {
        text: "Enable VTP pruning.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "Before the switch is put in the correct VTP domain and in client mode, the switch must be connected to any other switch in the VTP domain through a trunk in order to receive/transmit VTP information.",
  },
  {
    question:
      "Refer to the exhibit. Consider that the main power has just been restored. PC3 issues a broadcast IPv4 DHCP request. To which port will SW1 forward this request?",
    answers: [
      {
        text: "to Fa0/1, Fa0/2, and Fa0/3 only",
        correct: true,
      },
      {
        text: "to Fa0/1, Fa0/2, Fa0/3, and Fa0/4",
        correct: false,
      },
      {
        text: "to Fa0/1 only​",
        correct: false,
      },
      {
        text: "to Fa0/1, Fa0/2, and Fa0/4 only",
        correct: false,
      },
      {
        text: "to Fa0/1 and Fa0/2 only",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2020/01/i245718v1n1_1.png?ezimgfmt=ng:webp/ngcb2",
    explanation: "",
  },
  {
    question:
      "What action takes place when the source MAC address of a frame entering a switch is not in the MAC address table?",
    answers: [
      {
        text: "The switch adds a MAC address table entry for the destination MAC address and the egress port.",
        correct: false,
      },
      {
        text: "The switch adds the MAC address and incoming port number to the table.",
        correct: true,
      },
      {
        text: "The switch replaces the old entry and uses the more current port.",
        correct: false,
      },
      {
        text: "The switch updates the refresh timer for the entry.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Employees are unable to connect to servers on one of the internal networks. What should be done or checked?",
    answers: [
      {
        text: "Use the “show ip interface brief” command to see if an interface is down.",
        correct: true,
      },
      {
        text: "Verify that there is not a default route in any of the edge router routing tables.",
        correct: false,
      },
      {
        text: "Create static routes to all internal networks and a default route to the internet.",
        correct: false,
      },
      {
        text: "Check the statistics on the default route for oversaturation.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What is the effect of entering the ip dhcp snooping configuration command on a switch?",
    answers: [
      {
        text: "It enables DHCP snooping globally on a switch.",
        correct: true,
      },
      {
        text: "It enables PortFast globally on a switch.",
        correct: false,
      },
      {
        text: "It disables DTP negotiations on trunking ports.",
        correct: false,
      },
      {
        text: "It manually enables a trunk link.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "An administrator notices that large numbers of packets are being dropped on one of the branch routers. What should be done or checked?",
    answers: [
      {
        text: "Create static routes to all internal networks and a default route to the internet.",
        correct: false,
      },
      {
        text: "Create extra static routes to the same location with an AD of 1.",
        correct: false,
      },
      {
        text: "Check the statistics on the default route for oversaturation.",
        correct: false,
      },
      {
        text: "Check the routing table for a missing static route.",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What are two switch characteristics that could help alleviate network congestion? (Choose two.)",
    answers: [
      {
        text: "fast internal switching",
        correct: true,
      },
      {
        text: "large frame buffers",
        correct: true,
      },
      {
        text: "store-and-forward switching",
        correct: false,
      },
      {
        text: "low port density",
        correct: false,
      },
      {
        text: "frame check sequence (FCS) check",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question: "What is a result of connecting two or more switches together?",
    answers: [
      {
        text: "The number of broadcast domains is increased.",
        correct: false,
      },
      {
        text: "The size of the broadcast domain is increased.",
        correct: true,
      },
      {
        text: "The number of collision domains is reduced.",
        correct: false,
      },
      {
        text: "The size of the collision domain is increased.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "When two or more switches are connected together, the size of the broadcast domain is increased and so is the number of collision domains. The number of broadcast domains is increased only when routers are added.",
  },
  {
    question:
      "Branch users were able to access a site in the morning but have had no connectivity with the site since lunch time. What should be done or checked?",
    answers: [
      {
        text: "Verify that the static route to the server is present in the routing table.",
        correct: false,
      },
      {
        text: "Use the “show ip interface brief” command to see if an interface is down.",
        correct: true,
      },
      {
        text: "Check the configuration on the floating static route and adjust the AD.",
        correct: false,
      },
      {
        text: "Create a floating static route to that network.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What is the effect of entering the switchport port-security configuration command on a switch?",
    answers: [
      {
        text: "It dynamically learns the L2 address and copies it to the running configuration.",
        correct: false,
      },
      {
        text: "It enables port security on an interface.",
        correct: true,
      },
      {
        text: "It enables port security globally on the switch.",
        correct: false,
      },
      {
        text: "It restricts the number of discovery messages, per second, to be received on the interface.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A network administrator is configuring a WLAN. Why would the administrator use multiple lightweight APs?",
    answers: [
      {
        text: "to centralize management of multiple WLANs",
        correct: false,
      },
      {
        text: "to monitor the operation of the wireless network",
        correct: true,
      },
      {
        text: "to provide prioritized service for time-sensitive applications",
        correct: false,
      },
      {
        text: "to facilitate group configuration and management of multiple WLANs through a WLC",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. PC-A and PC-B are both in VLAN 60. PC-A is unable to communicate with PC-B. What is the problem?",
    answers: [
      {
        text: "The native VLAN should be VLAN 60.",
        correct: false,
      },
      {
        text: "The native VLAN is being pruned from the link.",
        correct: false,
      },
      {
        text: "The trunk has been configured with the switchport nonegotiate command.",
        correct: false,
      },
      {
        text: "The VLAN that is used by PC-A is not in the list of allowed VLANs on the trunk.",
        correct: true,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2016/02/i211586v1n1_Question-5.png?ezimgfmt=ng:webp/ngcb2",
    explanation:
      "Because PC-A and PC-B are connected to different switches, traffic between them must flow over the trunk link. Trunks can be configured so that they only allow traffic for particular VLANs to cross the link. In this scenario, VLAN 60, the VLAN that is associated with PC-A and PC-B, has not been allowed across the link, as shown by the output of show interfaces trunk.",
  },
  {
    question:
      "A network administrator is configuring a WLAN. Why would the administrator use RADIUS servers on the network?",
    answers: [
      {
        text: "to centralize management of multiple WLANs",
        correct: false,
      },
      {
        text: "to restrict access to the WLAN by authorized, authenticated users only",
        correct: true,
      },
      {
        text: "to facilitate group configuration and management of multiple WLANs through a WLC",
        correct: false,
      },
      {
        text: "to monitor the operation of the wireless network",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What is the effect of entering the switchport mode access configuration command on a switch?",
    answers: [
      {
        text: "It enables BPDU guard on a specific port.",
        correct: false,
      },
      {
        text: "It manually enables a trunk link.",
        correct: false,
      },
      {
        text: "It disables an unused port.",
        correct: false,
      },
      {
        text: "It disables DTP on a non-trunking interface.",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A network administrator has configured a router for stateless DHCPv6 operation. However, users report that workstations are not receiving DNS server information. Which two router configuration lines should be verified to ensure that stateless DHCPv6 service is properly configured? (Choose two.)",
    answers: [
      {
        text: "The domain-name line is included in the ipv6 dhcp pool section.",
        correct: false,
      },
      {
        text: "The dns-server line is included in the ipv6 dhcp pool section.",
        correct: true,
      },
      {
        text: "The ipv6 nd other-config-flag is entered for the interface that faces the LAN segment.",
        correct: true,
      },
      {
        text: "The address prefix line is included in the ipv6 dhcp pool section.",
        correct: false,
      },
      {
        text: "The ipv6 nd managed-config-flag is entered for the interface that faces the LAN segment.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "To use the stateless DHCPv6 method, the router must inform DHCPv6 clients to configure a SLAAC IPv6 address and contact the DHCPv6 server for additional configuration parameters, such as the DNS server address. This is done through the command ipv6 nd other-config-flag entered at the interface configuration mode. The DNS server address is indicated in the ipv6 dhcp pool configuration.",
  },
  {
    question:
      "A network administrator is configuring a WLAN. Why would the administrator disable the broadcast feature for the SSID?",
    answers: [
      {
        text: "to eliminate outsiders scanning for available SSIDs in the area",
        correct: true,
      },
      {
        text: "to centralize management of multiple WLANs",
        correct: false,
      },
      {
        text: "to facilitate group configuration and management of multiple WLANs through a WLC",
        correct: false,
      },
      {
        text: "to provide prioritized service for time-sensitive applications",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Refer to the exhibit. An administrator is attempting to install an IPv6 static route on router R1 to reach the network attached to router R2. After the static route command is entered, connectivity to the network is still failing. What error has been made in the static route configuration?",
    answers: [
      {
        text: "The next hop address is incorrect.",
        correct: false,
      },
      {
        text: "The interface is incorrect.",
        correct: true,
      },
      {
        text: "The destination network is incorrect.",
        correct: false,
      },
      {
        text: "The network prefix is incorrect.",
        correct: false,
      },
    ],
    photograph:
      "https://itexamanswers.net/wp-content/uploads/2019/12/2020-01-17_100010.jpg?ezimgfmt=rs:734x316/rscb2/ng:webp/ngcb2",
    explanation:
      "In this example the interface in the static route is incorrect. The interface should be the exit interface on R1, which is s0/0/0.",
  },
  {
    question:
      "What action takes place when a frame entering a switch has a unicast destination MAC address that is not in the MAC address table?",
    answers: [
      {
        text: "The switch updates the refresh timer for the entry.",
        correct: false,
      },
      {
        text: "The switch resets the refresh timer on all MAC address table entries.",
        correct: false,
      },
      {
        text: "The switch replaces the old entry and uses the more current port.",
        correct: false,
      },
      {
        text: "The switch will forward the frame out all ports except the incoming port.",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A junior technician was adding a route to a LAN router. A traceroute to a device on the new network revealed a wrong path and unreachable status. What should be done or checked?",
    answers: [
      {
        text: "Create a floating static route to that network.",
        correct: false,
      },
      {
        text: "Check the configuration on the floating static route and adjust the AD.",
        correct: false,
      },
      {
        text: "Check the configuration of the exit interface on the new static route.",
        correct: true,
      },
      {
        text: "Verify that the static route to the server is present in the routing table.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What is the effect of entering the ip arp inspection vlan 10 configuration command on a switch?",
    answers: [
      {
        text: "It specifies the maximum number of L2 addresses allowed on a port.",
        correct: false,
      },
      {
        text: "It enables DAI on specific switch interfaces previously configured with DHCP snooping.",
        correct: true,
      },
      {
        text: "It enables DHCP snooping globally on a switch.",
        correct: false,
      },
      {
        text: "It globally enables BPDU guard on all PortFast-enabled ports.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What protocol or technology manages trunk negotiations between switches?",
    answers: [
      {
        text: "VTP",
        correct: false,
      },
      {
        text: "EtherChannel",
        correct: false,
      },
      {
        text: "DTP",
        correct: true,
      },
      {
        text: "STP",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A network administrator is configuring a WLAN. Why would the administrator apply WPA2 with AES to the WLAN?",
    answers: [
      {
        text: "to reduce the risk of unauthorized APs being added to the network",
        correct: false,
      },
      {
        text: "to centralize management of multiple WLANs",
        correct: false,
      },
      {
        text: "to provide prioritized service for time-sensitive applications",
        correct: false,
      },
      {
        text: "to provide privacy and integrity to wireless traffic by using encryption",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Users on a LAN are unable to get to a company web server but are able to get elsewhere. What should be done or checked?",
    answers: [
      {
        text: "Ensure that the old default route has been removed from the company edge routers.",
        correct: false,
      },
      {
        text: "Verify that the static route to the server is present in the routing table.",
        correct: true,
      },
      {
        text: "Check the configuration on the floating static route and adjust the AD.",
        correct: false,
      },
      {
        text: "Create a floating static route to that network.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question: "What IPv6 prefix is designed for link-local communication?",
    answers: [
      {
        text: "2001::/3",
        correct: false,
      },
      {
        text: "ff00::/8",
        correct: false,
      },
      {
        text: "fc::/07",
        correct: false,
      },
      {
        text: "fe80::/10",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What is the effect of entering the ip dhcp snooping limit rate 6 configuration command on a switch?",
    answers: [
      {
        text: "It displays the IP-to-MAC address associations for switch interfaces.",
        correct: false,
      },
      {
        text: "It restricts the number of discovery messages, per second, to be received on the interface.",
        correct: true,
      },
      {
        text: "It enables port security globally on the switch.",
        correct: false,
      },
      {
        text: "It dynamically learns the L2 address and copies it to the running configuration.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A network administrator is configuring a WLAN. Why would the administrator change the default DHCP IPv4 addresses on an AP?",
    answers: [
      {
        text: "to eliminate outsiders scanning for available SSIDs in the area",
        correct: false,
      },
      {
        text: "to reduce the risk of unauthorized APs being added to the network",
        correct: false,
      },
      {
        text: "to reduce outsiders intercepting data or accessing the wireless network by using a well-known address range",
        correct: true,
      },
      {
        text: "to reduce the risk of interference by external devices such as microwave ovens",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What is the effect of entering the ip arp inspection validate src-mac configuration command on a switch?",
    answers: [
      {
        text: "It checks the source L2 address in the Ethernet header against the sender L2 address in the ARP body.",
        correct: true,
      },
      {
        text: "It disables all trunk ports.",
        correct: false,
      },
      {
        text: "It displays the IP-to-MAC address associations for switch interfaces.",
        correct: false,
      },
      {
        text: "It enables portfast on a specific switch interface.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What protocol or technology is a Cisco proprietary protocol that is automatically enabled on 2960 switches",
    answers: [
      {
        text: "DTP",
        correct: true,
      },
      {
        text: "STP",
        correct: false,
      },
      {
        text: "VTP",
        correct: false,
      },
      {
        text: "EtherChannel",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What address and prefix length is used when configuring an IPv6 default static route?",
    answers: [
      {
        text: "FF02::1/8",
        correct: false,
      },
      {
        text: "::/0",
        correct: true,
      },
      {
        text: "0.0.0.0/0",
        correct: false,
      },
      {
        text: "::1/128",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What are two characteristics of Cisco Express Forwarding (CEF)? (Choose two.)",
    answers: [
      {
        text: "When a packet arrives on a router interface, it is forwarded to the control plane where the CPU matches the destination address with a matching routing table entry.",
        correct: false,
      },
      {
        text: "This is the fastest forwarding mechanism on Cisco routers and multilayer switches.",
        correct: true,
      },
      {
        text: "With this switching method, flow information for a packet is stored in the fast-switching cache to forward future packets to the same destination without CPU intervention.",
        correct: false,
      },
      {
        text: "Packets are forwarded based on information in the FIB and an adjacency table.",
        correct: true,
      },
      {
        text: "When a packet arrives on a router interface, it is forwarded to the control plane where the CPU searches for a match in the fast-switching cache.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Which term describes the role of a Cisco switch in the 802.1X port-based access control?",
    answers: [
      {
        text: "agent",
        correct: false,
      },
      {
        text: "supplicant",
        correct: false,
      },
      {
        text: "authenticator",
        correct: true,
      },
      {
        text: "authentication server",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Which Cisco solution helps prevent ARP spoofing and ARP poisoning attacks?",
    answers: [
      {
        text: "Dynamic ARP Inspection",
        correct: true,
      },
      {
        text: "IP Source Guard",
        correct: false,
      },
      {
        text: "DHCP Snooping",
        correct: false,
      },
      {
        text: "Port Security",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question: "What is an advantage of PVST+?",
    answers: [
      {
        text: "PVST+ optimizes performance on the network through autoselection of the root bridge.",
        correct: false,
      },
      {
        text: "PVST+ optimizes performance on the network through load sharing.",
        correct: true,
      },
      {
        text: "PVST+ reduces bandwidth consumption compared to traditional implementations of STP that use CST.",
        correct: false,
      },
      {
        text: "PVST+ requires fewer CPU cycles for all the switches in the network.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "PVST+ results in optimum load balancing. However, this is accomplished by manually configuring switches to be elected as root bridges for different VLANs on the network. The root bridges are not automatically selected. Furthermore, having spanning-tree instances for each VLAN actually consumes more bandwidth and it increases the CPU cycles for all the switches in the network.",
  },
  {
    question:
      "What protocol or technology uses a standby router to assume packet-forwarding responsibility if the active router fails?",
    answers: [
      {
        text: "EtherChannel",
        correct: false,
      },
      {
        text: "HSRP",
        correct: true,
      },
      {
        text: "DTP",
        correct: false,
      },
      {
        text: "VTP",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What is the effect of entering the show ip dhcp snooping binding configuration command on a switch?",
    answers: [
      {
        text: "It switches a trunk port to access mode.",
        correct: false,
      },
      {
        text: "It checks the source L2 address in the Ethernet header against the sender L2 address in the ARP body.",
        correct: false,
      },
      {
        text: "It restricts the number of discovery messages, per second, to be received on the interface.",
        correct: false,
      },
      {
        text: "It displays the IP-to-MAC address associations for switch interfaces.",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What action takes place when the source MAC address of a frame entering a switch is in the MAC address table?",
    answers: [
      {
        text: "The switch forwards the frame out of the specified port.",
        correct: false,
      },
      {
        text: "The switch updates the refresh timer for the entry.",
        correct: true,
      },
      {
        text: "The switch replaces the old entry and uses the more current port.",
        correct: false,
      },
      {
        text: "The switch adds a MAC address table entry for the destination MAC address and the egress port.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A small publishing company has a network design such that when a broadcast is sent on the LAN, 200 devices receive the transmitted broadcast. How can the network administrator reduce the number of devices that receive broadcast traffic?",
    answers: [
      {
        text: "Add more switches so that fewer devices are on a particular switch.",
        correct: false,
      },
      {
        text: "Replace the switches with switches that have more ports per switch. This will allow more devices on a particular switch.",
        correct: false,
      },
      {
        text: "Segment the LAN into smaller LANs and route between them.*",
        correct: true,
      },
      {
        text: "Replace at least half of the switches with hubs to reduce the size of the broadcast domain.",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "By dividing the one big network into two smaller network, the network administrator has created two smaller broadcast domains. When a broadcast is sent on the network now, the broadcast will only be sent to the devices on the same Ethernet LAN. The other LAN will not receive the broadcast.",
  },
  {
    question: "167. What defines a host route on a Cisco router?",
    answers: [
      {
        text: "The link-local address is added automatically to the routing table as an IPv6 host route.",
        correct: false,
      },
      {
        text: "An IPv4 static host route configuration uses a destination IP address of a specific device and a /32 subnet mask.",
        correct: true,
      },
      {
        text: "A host route is designated with a C in the routing table.",
        correct: false,
      },
      {
        text: "A static IPv6 host route must include the interface type and the interface number of the next hop router.",
        correct: false,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "What else is required when configuring an IPv6 static route using a next-hop link-local address?",
    answers: [
      {
        text: "administrative distance",
        correct: false,
      },
      {
        text: "ip address of the neighbor router",
        correct: false,
      },
      {
        text: "network number and subnet mask on the interface of the neighbor router",
        correct: false,
      },
      {
        text: "interface number and type",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "A technician is configuring a wireless network for a small business using a SOHO wireless router. Which two authentication methods are used, if the router is configured with WPA2? (Choose two.)",
    answers: [
      {
        text: "personal",
        correct: true,
      },
      {
        text: "AES",
        correct: false,
      },
      {
        text: "TKIP",
        correct: false,
      },
      {
        text: "WEP",
        correct: false,
      },
      {
        text: "enterprise",
        correct: true,
      },
    ],
    photograph: "",
    explanation: "",
  },
  {
    question:
      "Which mitigation technique would prevent rogue servers from providing false IPv6 configuration parameters to clients?",
    answers: [
      {
        text: "enabling RA Guard",
        correct: false,
      },
      {
        text: "enabling DHCPv6 Guard",
        correct: true,
      },
      {
        text: "implementing port security on edge ports",
        correct: false,
      },
      {
        text: "disabling CDP on edge ports",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "DHCPv6 Guard is a feature designed to ensure that rogue DHCPv6 servers are not able to hand out addresses to clients, redirect client traffic, or starve out the DHCPv6 server and cause a DoS attack. DHCPv6 Guard requires a policy to be configured in DHCP Guard configuration mode, and DHCPv6 Guard is enabled on an interface-by-interface basis.",
  },
  {
    question:
      "A PC has sent an RS message to an IPv6 router attached to the same network. Which two pieces of information will the router send to the client? (Choose two.)",
    answers: [
      {
        text: "prefix length",
        correct: true,
      },
      {
        text: "subnet mask in dotted decimal notation",
        correct: false,
      },
      {
        text: "domain name",
        correct: false,
      },
      {
        text: "administrative ",
        correct: false,
      },
      {
        text: "prefix",
        correct: true,
      },
      {
        text: "DNS server IP address",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "Router is part of the IPv6 all-routers group and received the RS message. It generates an RA containing the local network prefix and prefix length (e.g., 2001:db8:acad:1::/64)",
  },
  {
    question:
      "While attending a conference, participants are using laptops for network connectivity. When a guest speaker attempts to connect to the network, the laptop fails to display any available wireless networks. The access point must be operating in which mode?",
    answers: [
      {
        text: "mixed",
        correct: false,
      },
      {
        text: "active",
        correct: true,
      },
      {
        text: "passive",
        correct: false,
      },
      {
        text: "open",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "Active is a mode used to configure an access point so that clients must know the SSID to connect to the access point. APs and wireless routers can operate in a mixed mode meaning that that multiple wireless standards are supported. Open is an authentication mode for an access point that has no impact on the listing of available wireless networks for a client. When an access point is configured in passive mode, the SSID is broadcast so that the name of wireless network will appear in the listing of available networks for clients.",
  },
  {
    question: "Which three components are combined to form a bridge ID?",
    answers: [
      {
        text: "extended system ID",
        correct: true,
      },
      {
        text: "cost",
        correct: false,
      },
      {
        text: "IP address",
        correct: false,
      },
      {
        text: "bridge priority",
        correct: true,
      },
      {
        text: "MAC address",
        correct: true,
      },
      {
        text: "port ID",
        correct: false,
      },
    ],
    photograph: "",
    explanation:
      "The three components that are combined to form a bridge ID are bridge priority, extended system ID, and MAC address",
  },
];
