/*


                                        USER PART


                                        
*/

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.navigation ul li');
    const currentSectionTitle = document.getElementById(
        'current-section-title'
    );
    const logoutButton = document.getElementById('logout-button');
    const globalSearchInput = document.getElementById('global-search-input'); // Global search bar

    // Sidebar elements to update
    const sidebarUserName = document.getElementById('sidebar-user-name');
    const sidebarProfilePic = document.getElementById('sidebar-profile-pic');

    // Modals
    const caseDetailModal = document.getElementById('case-detail-modal');
    const modalCaseDetails = document.getElementById('modal-case-details');
    const findLawyerModal = document.getElementById('find-lawyer-modal');
    const newConsultationForm = document.getElementById(
        'new-consultation-form'
    );
    const uploadDocumentInput = document.getElementById('upload-document');
    const uploadedDocNameSpan = document.getElementById('uploaded-doc-name');
    const closeButtons = document.querySelectorAll('.close-button');

    // --- Sample Data (Replace with actual data fetched from a backend) ---
    let clientData = JSON.parse(localStorage.getItem('clientData')) || {
        fullName: 'Anupam',
        email: 'anupam.client@example.com',
        password: 'clientpassword123', // Dummy password
        phone: '+91 99887 76655',
        location: 'Bengaluru, Karnataka',
        profilePic: 'https://placehold.co/50x50/e0e0e0/333333?text=User'
    };

    let userCases = JSON.parse(localStorage.getItem('userCases')) || [
        {
            id: 'C-001',
            type: 'Family Law',
            lawyerName: 'Anupam Lawyer',
            lastUpdate: 'May 20, 2024',
            status: 'Active',
            description:
                'Divorce case initiated. Awaiting first hearing date. Need assistance with child custody.',
            documents: [
                {
                    name: 'Marriage Certificate.pdf',
                    content:
                        'This is a dummy content for Marriage Certificate. It confirms the legal union.'
                }
            ]
        },
        {
            id: 'C-002',
            type: 'Property Dispute',
            lawyerName: 'Priya Sharma',
            lastUpdate: 'Apr 10, 2024',
            status: 'Pending',
            description:
                'Dispute over land boundary with neighbor. Submitted initial documents. Lawyer is reviewing.',
            documents: [
                {
                    name: 'Property Deed.jpg',
                    content:
                        'This is a dummy content for Property Deed. It outlines the property boundaries.'
                }
            ]
        },
        {
            id: 'C-003',
            type: 'Contract Review',
            lawyerName: 'Anupam Lawyer',
            lastUpdate: 'Mar 01, 2024',
            status: 'Completed',
            description:
                'Contract for new business venture reviewed and finalized. All terms agreed upon.',
            documents: [
                {
                    name: 'Business Contract.pdf',
                    content:
                        'This is a dummy content for Business Contract. It details the terms and conditions of the agreement.'
                }
            ]
        }
    ];

    let myLawyers = JSON.parse(localStorage.getItem('myLawyers')) || [
        {
            id: 'L-001',
            name: 'Anupam Lawyer',
            email: 'anupam.lawyer@example.com',
            phone: '9876543210',
            specialization: 'Family Law',
            profilePic: 'https://placehold.co/45x45/e0e0e0/333333?text=AL'
        },
        {
            id: 'L-002',
            name: 'Priya Sharma',
            email: 'priya.sharma@example.com',
            phone: '9988776655',
            specialization: 'Property Law',
            profilePic: 'https://placehold.co/45x45/e0e0e0/333333?text=PS'
        }
    ];

    let messagesData = JSON.parse(localStorage.getItem('messagesData')) || {
        'Anupam Lawyer': [
            {
                sender: 'You',
                message: 'Hi Anupam, checking on case C-001.',
                time: '2025-05-28T10:00:00',
                type: 'sent'
            },
            {
                sender: 'Anupam Lawyer',
                message:
                    'Hello! Case C-001 is progressing well. I will have an update for you by end of day.',
                time: '2025-05-28T10:05:00',
                type: 'received'
            }
        ],
        'Priya Sharma': [
            {
                sender: 'Priya Sharma',
                message:
                    "Hi, regarding C-002, I have reviewed the documents. Let's schedule a call.",
                time: '2025-05-27T15:30:00',
                type: 'received'
            },
            {
                sender: 'You',
                message: 'Sounds good, Priya. How about tomorrow at 11 AM?',
                time: '2025-05-27T15:35:00',
                type: 'sent'
            }
        ]
    };

    let userDocuments = JSON.parse(localStorage.getItem('userDocuments')) || [
        {
            id: 'DOC-001',
            name: 'Marriage Certificate.pdf',
            caseId: 'C-001',
            lawyerName: 'Anupam Lawyer',
            uploadDate: 'May 15, 2024',
            content:
                'This is the scanned copy of my marriage certificate. It is crucial for the divorce proceedings.'
        },
        {
            id: 'DOC-002',
            name: 'Property Deed.jpg',
            caseId: 'C-002',
            lawyerName: 'Priya Sharma',
            uploadDate: 'Apr 05, 2024',
            content:
                'Image of the property deed for the land dispute. Shows the legal ownership and boundaries.'
        },
        {
            id: 'DOC-003',
            name: 'Business Contract.pdf',
            caseId: 'C-003',
            lawyerName: 'Anupam Lawyer',
            uploadDate: 'Feb 28, 2024',
            content:
                'Finalized business contract with all terms and conditions.'
        },
        {
            id: 'DOC-004',
            name: 'ID Proof.pdf',
            caseId: 'N/A',
            lawyerName: 'N/A',
            uploadDate: 'Jan 10, 2024',
            content: 'My government issued identification document.'
        }
    ];

    let currentOpenLawyerForMessages = null; // Tracks which lawyer's chat is open
    let currentDocumentFilterCaseId = null; // Tracks which case's documents are being viewed
    let currentDocumentFilterLawyerName = null; // Tracks which lawyer's documents are being viewed

    // --- Local Storage Sync Functions ---
    function saveClientData() {
        localStorage.setItem('clientData', JSON.stringify(clientData));
    }
    function saveUserCases() {
        localStorage.setItem('userCases', JSON.stringify(userCases));
    }
    function saveMyLawyers() {
        localStorage.setItem('myLawyers', JSON.stringify(myLawyers));
    }
    function saveMessagesData() {
        localStorage.setItem('messagesData', JSON.stringify(messagesData));
    }
    function saveUserDocuments() {
        localStorage.setItem('userDocuments', JSON.stringify(userDocuments));
    }

    // --- Helper Functions ---

    // Function to get lawyer profile picture URL
    function getLawyerProfilePic(lawyerName) {
        const lawyer = myLawyers.find((l) => l.name === lawyerName);
        return lawyer
            ? lawyer.profilePic
            : 'https://placehold.co/45x45/e0e0e0/333333?text=L'; // Default placeholder
    }

    // Function to update sidebar user info
    function updateSidebarUserInfo() {
        sidebarUserName.textContent = clientData.fullName;
        sidebarProfilePic.src = clientData.profilePic;
    }

    // Function to render sections
    function renderSection(sectionName, data = {}) {
        globalSearchInput.value = ''; // Clear global search when navigating
        contentArea.innerHTML = ''; // Clear previous content
        currentSectionTitle.textContent = sectionName
            .replace('-', ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '); // Capitalize and format title

        // Update active navigation link
        navLinks.forEach((link) => link.classList.remove('active'));
        const activeLink = document.querySelector(
            `.navigation ul li[data-section="${sectionName}"]`
        );
        if (activeLink) {
            activeLink.classList.add('active');
        }

        switch (sectionName) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'my-cases':
                renderMyCases();
                break;
            case 'my-lawyers':
                renderMyLawyers();
                break;
            case 'messages':
                renderMessages(data.lawyerName); // Pass lawyer name if coming from "Contact"
                break;
            case 'my-documents':
                renderMyDocuments(data.caseId, data.lawyerName, data.docName); // Pass caseId or lawyerName for filtering documents
                break;
            case 'profile':
                renderProfile();
                break;
            case 'chatbot':
                // Redirect to index.html when chatbot is clicked
                window.location.href = 'index.html';
                break;
            default:
                contentArea.innerHTML =
                    '<h2 class="section-header">Page Not Found</h2><p>The requested section does not exist.</p>';
        }
    }

    // --- Section Render Functions ---

    function renderDashboard() {
        // Calculate summary data for client
        const activeCasesCount = userCases.filter(
            (c) => c.status === 'Active' || c.status === 'Pending'
        ).length;
        const totalLawyersCount = myLawyers.length;
        const upcomingConsultationsCount = 0; // Placeholder for now, could be from a schedule

        let dashboardHtml = `
            <h2 class="section-header">Dashboard</h2>
            <div class="dashboard-summary-grid">
                <div class="summary-card">
                    <i class="fas fa-briefcase icon"></i>
                    <div class="value">${activeCasesCount}</div>
                    <div class="label">Active Cases</div>
                </div>
                <div class="summary-card">
                    <i class="fas fa-gavel icon"></i>
                    <div class="value">${totalLawyersCount}</div>
                    <div class="label">My Lawyers</div>
                </div>
                <div class="summary-card">
                    <i class="fas fa-calendar-alt icon"></i>
                    <div class="value">${upcomingConsultationsCount}</div>
                    <div class="label">Upcoming Consultations</div>
                </div>
            </div>

            <div class="find-lawyer-section">
                <h3>Find New Lawyer / Consultation</h3>
                <canvas id="find-lawyer-canvas"></canvas>
                <button class="find-lawyer-button" id="find-lawyer-btn" >Request New Consultation</button>
            </div>

            <div class="dashboard-section-card">
                <div class="dashboard-section-header">
                    <h3>Recent Cases</h3>
                    <button class="view-all-button" data-target-section="my-cases">View All</button>
                </div>
                <table class="recent-cases-table">
                    <thead>
                        <tr>
                            <th>Case ID</th>
                            <th>Type</th>
                            <th>Lawyer</th>
                            <th>Status</th>
                            <th>Last Update</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        // Display top 4 recent cases
        userCases.slice(0, 4).forEach((caseItem) => {
            const statusClass =
                caseItem.status === 'Active'
                    ? 'status-active'
                    : caseItem.status === 'Pending'
                    ? 'status-pending'
                    : 'status-completed';
            dashboardHtml += `
                <tr>
                    <td>${caseItem.id}</td>
                    <td>${caseItem.type}</td>
                    <td>${caseItem.lawyerName}</td>
                    <td><span class="${statusClass}">${caseItem.status}</span></td>
                    <td>${caseItem.lastUpdate}</td>
                </tr>
            `;
        });
        dashboardHtml += `
                    </tbody>
                </table>
            </div>
        `;
        // Removed the chatbot-dashboard-card from here as per new requirement
        contentArea.innerHTML = dashboardHtml;

        // Add event listeners for dashboard buttons
        contentArea
            .querySelector('.view-all-button')
            .addEventListener('click', () => renderSection('my-cases'));

        // Find New Lawyer button listener
        const findLawyerBtn = document.getElementById('find-lawyer-btn');
        if (findLawyerBtn) {
            findLawyerBtn.addEventListener(
                'click',
                () => (findLawyerModal.style.display = 'flex')
            );
        }

        // Initialize 3D animation
        initFindLawyerAnimation();
    }

    function initFindLawyerAnimation() {
        const canvas = document.getElementById('find-lawyer-canvas');
        if (!canvas) return; // Exit if canvas not found (e.g., on other sections)

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true
        }); // alpha: true for transparent background
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Add a simple shape (e.g., a spinning dodecahedron)
        const geometry = new THREE.DodecahedronGeometry(0.8); // Smaller size
        const material = new THREE.MeshStandardMaterial({
            color: 0x007bff,
            flatShading: true
        }); // Blue, flat shading
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
        scene.add(ambientLight);

        // Add directional light for shadows and definition
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        camera.position.z = 2;

        const animate = () => {
            requestAnimationFrame(animate);

            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.008;

            renderer.render(scene, camera);
        };
        animate();

        // Handle canvas resize
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.target === canvas) {
                    const width = entry.contentRect.width;
                    const height = entry.contentRect.height;
                    renderer.setSize(width, height);
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                }
            }
        });
        resizeObserver.observe(canvas);
    }

    function renderMyCases() {
        let casesHtml = `
            <h2 class="section-header">My Cases</h2>
            <table class="cases-table">
                <thead>
                    <tr>
                        <th>Case ID</th>
                        <th>Type of Case</th>
                        <th>Lawyer</th>
                        <th>Last Update</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;
        const searchTerm = globalSearchInput.value.toLowerCase();
        const filteredCases = userCases.filter(
            (caseItem) =>
                caseItem.id.toLowerCase().includes(searchTerm) ||
                caseItem.type.toLowerCase().includes(searchTerm) ||
                caseItem.lawyerName.toLowerCase().includes(searchTerm) ||
                (caseItem.description &&
                    caseItem.description.toLowerCase().includes(searchTerm))
        );

        if (filteredCases.length > 0) {
            filteredCases.forEach((caseItem) => {
                const statusClass =
                    caseItem.status === 'Active'
                        ? 'status-active'
                        : caseItem.status === 'Pending'
                        ? 'status-pending'
                        : 'status-completed';
                casesHtml += `
                    <tr>
                        <td>${caseItem.id}</td>
                        <td>${caseItem.type}</td>
                        <td>${caseItem.lawyerName}</td>
                        <td>${caseItem.lastUpdate}</td>
                        <td><span class="${statusClass}">${caseItem.status}</span></td>
                        <td><button class="view-case-button" data-case-id="${caseItem.id}">View</button></td>
                    </tr>
                `;
            });
        } else {
            casesHtml += `<tr><td colspan="6">No cases found matching "${searchTerm}".</td></tr>`;
        }
        casesHtml += `
                </tbody>
            </table>
        `;
        contentArea.innerHTML = casesHtml;

        // Add event listeners for "View" buttons
        contentArea.querySelectorAll('.view-case-button').forEach((button) => {
            button.addEventListener('click', (event) => {
                const caseId = event.target.dataset.caseId;
                const caseDetails = userCases.find((c) => c.id === caseId);
                if (caseDetails) {
                    modalCaseDetails.innerHTML = `
                        <p><strong>Case ID:</strong> ${caseDetails.id}</p>
                        <p><strong>Type of Case:</strong> ${
                            caseDetails.type
                        }</p>
                        <p><strong>Lawyer:</strong> ${
                            caseDetails.lawyerName
                        }</p>
                        <p><strong>Last Update:</strong> ${
                            caseDetails.lastUpdate
                        }</p>
                        ${
                            caseDetails.description
                                ? `<p><strong>Description:</strong> ${caseDetails.description}</p>`
                                : ''
                        }
                        <p><strong>Documents:</strong>
                            ${
                                caseDetails.documents &&
                                caseDetails.documents.length > 0
                                    ? caseDetails.documents
                                          .map(
                                              (doc) =>
                                                  `<button class="view-doc-from-case" data-case-id="${caseId}" data-doc-name="${doc.name}">${doc.name}</button>`
                                          )
                                          .join(' ')
                                    : 'None'
                            }
                        </p>
                    `;
                    caseDetailModal.style.display = 'flex'; // Show modal

                    // Add event listeners for document view buttons within the modal
                    modalCaseDetails
                        .querySelectorAll('.view-doc-from-case')
                        .forEach((docButton) => {
                            docButton.addEventListener('click', (e) => {
                                const targetCaseId = e.target.dataset.caseId;
                                const targetDocName = e.target.dataset.docName;
                                caseDetailModal.style.display = 'none'; // Close current modal
                                renderSection('my-documents', {
                                    caseId: targetCaseId,
                                    docName: targetDocName
                                }); // Redirect to documents, filtered
                            });
                        });
                }
            });
        });

        // Attach a custom event listener for global search
        contentArea.addEventListener('globalSearch', (event) => {
            renderMyCases(); // Re-render with global search term
        });
    }

    function renderMyLawyers() {
        let lawyersHtml = '<h2 class="section-header">My Lawyers</h2>';
        lawyersHtml += `
            <div class="lawyer-cards">
        `;
        if (myLawyers.length > 0) {
            myLawyers.forEach((lawyer) => {
                lawyersHtml += `
                    <div class="lawyer-card">
                        <img src="${lawyer.profilePic}" alt="${lawyer.name} Profile" class="lawyer-profile-pic">
                        <h3>${lawyer.name}</h3>
                        <p>Specialization: ${lawyer.specialization}</p>
                        <p>Email: <a href="mailto:${lawyer.email}">${lawyer.email}</a></p>
                        <p>Phone: ${lawyer.phone}</p>
                        <div class="lawyer-actions">
                            <button class="contact-button" data-lawyer-name="${lawyer.name}">Contact</button>
                        </div>
                    </div>
                `;
            });
        } else {
            lawyersHtml += `<p style="text-align: center; width: 100%;">You have no associated lawyers yet.</p>`;
        }
        lawyersHtml += `
            </div>
        `;
        contentArea.innerHTML = lawyersHtml;

        // Add event listeners for "Contact" buttons
        contentArea.querySelectorAll('.contact-button').forEach((button) => {
            button.addEventListener('click', (event) => {
                const lawyerName = event.target.dataset.lawyerName;
                renderSection('messages', { lawyerName: lawyerName });
            });
        });
    }

    function renderMessages(selectedLawyerName = null) {
        let messagesHtml = '<h2 class="section-header">Messages</h2>';
        messagesHtml += `
            <div class="messages-container">
                <div class="message-list">
                    </div>
                <div class="message-chat-area">
                    <div class="chat-header">
                        <img src="https://placehold.co/40x40/e0e0e0/333333?text=L" alt="Lawyer Profile" class="profile-pic" id="chat-lawyer-profile-pic">
                        <span id="chat-lawyer-name">Select a chat</span>
                    </div>
                    <div class="chat-messages" id="chat-messages-container">
                        </div>
                    <div class="message-input-area">
                        <input type="text" id="message-input" placeholder="Type a message...">
                        <button id="send-message-button"><i class="fas fa-paper-plane"></i> Send</button>
                    </div>
                </div>
            </div>
        `;
        contentArea.innerHTML = messagesHtml;

        const messageListDiv = contentArea.querySelector('.message-list');
        const chatMessagesContainer = contentArea.querySelector(
            '#chat-messages-container'
        );
        const chatLawyerNameSpan =
            contentArea.querySelector('#chat-lawyer-name');
        const chatLawyerProfilePic = contentArea.querySelector(
            '#chat-lawyer-profile-pic'
        );
        const messageInput = contentArea.querySelector('#message-input');
        const sendMessageButton = contentArea.querySelector(
            '#send-message-button'
        );

        function loadMessageList() {
            messageListDiv.innerHTML = ''; // Clear existing list
            // Get all lawyer names from myLawyers
            const allLawyerNames = new Set(myLawyers.map((l) => l.name));
            // Add lawyer names from messagesData that might not be in myLawyers yet (e.g., new requests)
            Object.keys(messagesData).forEach((name) =>
                allLawyerNames.add(name)
            );

            // Convert set to array and sort by latest message time
            const sortedLawyerNames = Array.from(allLawyerNames).sort(
                (a, b) => {
                    const lastMsgA =
                        messagesData[a] && messagesData[a].length > 0
                            ? new Date(
                                  messagesData[a][
                                      messagesData[a].length - 1
                                  ].time
                              )
                            : new Date(0);
                    const lastMsgB =
                        messagesData[b] && messagesData[b].length > 0
                            ? new Date(
                                  messagesData[b][
                                      messagesData[b].length - 1
                                  ].time
                              )
                            : new Date(0);
                    return lastMsgB - lastMsgA; // Sort descending (latest on top)
                }
            );

            sortedLawyerNames.forEach((lawyerName) => {
                const latestMessage =
                    messagesData[lawyerName] &&
                    messagesData[lawyerName].length > 0
                        ? messagesData[lawyerName][
                              messagesData[lawyerName].length - 1
                          ]
                        : null;
                const preview = latestMessage
                    ? latestMessage.message
                    : 'No messages yet.';
                const time = latestMessage
                    ? new Date(latestMessage.time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                      })
                    : '';
                const profilePic = getLawyerProfilePic(lawyerName);

                const messageItemDiv = document.createElement('div');
                messageItemDiv.classList.add('message-item');
                if (lawyerName === currentOpenLawyerForMessages) {
                    messageItemDiv.classList.add('active');
                }
                messageItemDiv.dataset.lawyerName = lawyerName;
                messageItemDiv.innerHTML = `
                    <img src="${profilePic}" alt="Profile" class="profile-pic">
                    <div class="message-info">
                        <div class="message-sender">${lawyerName}</div>
                        <div class="message-preview">${preview}</div>
                    </div>
                    <div class="message-time">${time}</div>
                `;
                messageListDiv.appendChild(messageItemDiv);

                messageItemDiv.addEventListener('click', () =>
                    openChat(lawyerName)
                );
            });
        }

        sendMessageButton.addEventListener('click', () => {
            const messageText = messageInput.value.trim();
            if (messageText && currentOpenLawyerForMessages) {
                if (!messagesData[currentOpenLawyerForMessages]) {
                    messagesData[currentOpenLawyerForMessages] = [];
                }
                messagesData[currentOpenLawyerForMessages].push({
                    sender: 'You',
                    message: messageText,
                    time: new Date().toISOString(), // Use ISO string for consistent sorting
                    type: 'sent'
                });
                messageInput.value = ''; // Clear input
                saveMessagesData(); // Save to localStorage

                // Re-render the current chat and message list to show new message
                openChat(currentOpenLawyerForMessages);
                loadMessageList(); // Update the preview and sorting in the message list
            }
        });

        messageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessageButton.click();
            }
        });

        // Initialize message list and open chat if a lawyer was selected
        loadMessageList();
        if (selectedLawyerName) {
            openChat(selectedLawyerName);
        } else if (Object.keys(messagesData).length > 0) {
            // If no specific lawyer is selected, open the chat with the latest message
            const sortedLawyerNames = Array.from(
                Object.keys(messagesData)
            ).sort((a, b) => {
                const lastMsgA =
                    messagesData[a] && messagesData[a].length > 0
                        ? new Date(
                              messagesData[a][messagesData[a].length - 1].time
                          )
                        : new Date(0);
                const lastMsgB =
                    messagesData[b] && messagesData[b].length > 0
                        ? new Date(
                              messagesData[b][messagesData[b].length - 1].time
                          )
                        : new Date(0);
                return lastMsgB - lastMsgA; // Sort descending (latest on top)
            });
            const defaultLawyer = sortedLawyerNames[0];
            if (defaultLawyer) openChat(defaultLawyer);
        }
    }

    function renderMyDocuments(
        filterCaseId = null,
        filterLawyerName = null,
        highlightDocName = null
    ) {
        currentDocumentFilterCaseId = filterCaseId; // Store filter state
        currentDocumentFilterLawyerName = filterLawyerName; // Store filter state

        let documentsHtml = '<h2 class="section-header">My Documents</h2>';
        documentsHtml += `
            <div class="documents-search-bar">
                <input type="text" placeholder="Search by lawyer name, case ID, or document name..." id="document-search-input">
                <i class="fas fa-search"></i>
            </div>
            <div class="documents-grid">
        `;
        documentsHtml += `
            </div>
        `;
        contentArea.innerHTML = documentsHtml;

        const documentSearchInput = document.getElementById(
            'document-search-input'
        );
        const documentsGridContainer =
            contentArea.querySelector('.documents-grid');

        function displayDocuments(searchTerm = '') {
            documentsGridContainer.innerHTML = ''; // Clear existing cards
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            const filteredDocuments = userDocuments.filter((doc) => {
                const matchesCaseIdFilter = currentDocumentFilterCaseId
                    ? doc.caseId === currentDocumentFilterCaseId
                    : true;
                const matchesLawyerNameFilter = currentDocumentFilterLawyerName
                    ? doc.lawyerName === currentDocumentFilterLawyerName
                    : true;

                const matchesSearchTerm = lowerCaseSearchTerm
                    ? doc.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                      (doc.caseId &&
                          doc.caseId
                              .toLowerCase()
                              .includes(lowerCaseSearchTerm)) ||
                      (doc.lawyerName &&
                          doc.lawyerName
                              .toLowerCase()
                              .includes(lowerCaseSearchTerm))
                    : true;

                return (
                    matchesCaseIdFilter &&
                    matchesLawyerNameFilter &&
                    matchesSearchTerm
                );
            });

            if (filteredDocuments.length > 0) {
                // Group documents by case_id or lawyerName
                const groupedDocs = {};
                filteredDocuments.forEach((doc) => {
                    const key =
                        doc.caseId !== 'N/A'
                            ? `Case ID: ${doc.caseId}`
                            : `Lawyer: ${
                                  doc.lawyerName || 'General Documents'
                              }`;
                    if (!groupedDocs[key]) {
                        groupedDocs[key] = [];
                    }
                    groupedDocs[key].push(doc);
                });

                for (const groupKey in groupedDocs) {
                    const groupHeader = document.createElement('h3');
                    groupHeader.textContent = groupKey;
                    documentsGridContainer.appendChild(groupHeader);

                    groupedDocs[groupKey].forEach((doc) => {
                        const iconClass = doc.name.endsWith('.pdf')
                            ? 'fas fa-file-pdf'
                            : doc.name.endsWith('.jpg') ||
                              doc.name.endsWith('.png')
                            ? 'fas fa-file-image'
                            : doc.name.endsWith('.docx') ||
                              doc.name.endsWith('.doc')
                            ? 'fas fa-file-word'
                            : doc.name.endsWith('.xlsx') ||
                              doc.name.endsWith('.xls')
                            ? 'fas fa-file-excel'
                            : 'fas fa-file';
                        const documentCard = document.createElement('div');
                        documentCard.classList.add('document-card');
                        documentCard.innerHTML = `
                            <i class="${iconClass}"></i>
                            <h4>${doc.name}</h4>
                            <p>Lawyer: ${doc.lawyerName || 'N/A'}</p>
                            <p>Uploaded: ${doc.uploadDate}</p>
                            <button class="view-document-button" data-document-id="${
                                doc.id
                            }">View Document</button>
                        `;
                        documentsGridContainer.appendChild(documentCard);
                    });
                }
            } else {
                documentsGridContainer.innerHTML = `<p style="width: 100%; text-align: center;">No documents found for this criteria.</p>`;
            }

            // Add event listeners for "View Document" buttons
            documentsGridContainer
                .querySelectorAll('.view-document-button')
                .forEach((button) => {
                    button.addEventListener('click', (event) => {
                        const docId = event.target.dataset.documentId;
                        const documentDetails = userDocuments.find(
                            (d) => d.id === docId
                        );
                        if (documentDetails) {
                            modalCaseDetails.innerHTML = `
                            <h3>${documentDetails.name}</h3>
                            <p><strong>Case ID:</strong> ${
                                documentDetails.caseId || 'N/A'
                            }</p>
                            <p><strong>Lawyer:</strong> ${
                                documentDetails.lawyerName || 'N/A'
                            }</p>
                            <p><strong>Uploaded:</strong> ${
                                documentDetails.uploadDate
                            }</p>
                            <hr>
                            <p>${documentDetails.content}</p>
                        `;
                            caseDetailModal.style.display = 'flex'; // Reusing case detail modal for document view
                        }
                    });
                });
        }

        // Initial display of documents
        displayDocuments(documentSearchInput.value.toLowerCase()); // Use document-specific search input

        // Event listener for document-specific search input
        documentSearchInput.addEventListener('input', (event) => {
            displayDocuments(event.target.value.toLowerCase());
        });

        // Attach a custom event listener for global search
        contentArea.addEventListener('globalSearch', (event) => {
            documentSearchInput.value = event.detail.searchTerm; // Update local search bar
            displayDocuments(event.detail.searchTerm);
        });

        // If a specific document name was passed, try to open its modal
        if (highlightDocName) {
            const docToHighlight = userDocuments.find(
                (d) => d.name === highlightDocName && d.caseId === filterCaseId
            );
            if (docToHighlight) {
                modalCaseDetails.innerHTML = `
                    <h3>${docToHighlight.name}</h3>
                    <p><strong>Case ID:</strong> ${
                        docToHighlight.caseId || 'N/A'
                    }</p>
                    <p><strong>Lawyer:</strong> ${
                        docToHighlight.lawyerName || 'N/A'
                    }</p>
                    <p><strong>Uploaded:</strong> ${
                        docToHighlight.uploadDate
                    }</p>
                    <hr>
                    <p>${docToHighlight.content}</p>
                `;
                caseDetailModal.style.display = 'flex';
            }
        }
    }

    function renderProfile() {
        let profileHtml = `
            <h2 class="section-header">My Profile</h2>
            <div class="profile-details">
                <div class="profile-grid">
                    <div class="profile-field">
                        <label for="profile-full-name">Full Name</label>
                        <input type="text" id="profile-full-name" value="${clientData.fullName}">
                    </div>
                    <div class="profile-field">
                        <label for="profile-email">Email</label>
                        <input type="email" id="profile-email" value="${clientData.email}">
                    </div>
                    <div class="profile-field">
                        <label for="profile-password">Password</label>
                        <input type="password" id="profile-password" value="${clientData.password}" placeholder="********">
                    </div>
                    <div class="profile-field">
                        <label for="profile-phone">Phone</label>
                        <input type="tel" id="profile-phone" value="${clientData.phone}">
                    </div>
                    <div class="profile-field">
                        <label for="profile-location">Location</label>
                        <input type="text" id="profile-location" value="${clientData.location}">
                    </div>
                </div>
                <div class="profile-buttons">
                    <button id="cancel-profile-changes" class="cancel-button">Cancel</button>
                    <button id="save-profile-changes" class="save-button">Save Changes</button>
                </div>
            </div>
        `;
        contentArea.innerHTML = profileHtml;

        // Add event listeners for profile buttons
        const saveButton = document.getElementById('save-profile-changes');
        const cancelButton = document.getElementById('cancel-profile-changes');

        saveButton.addEventListener('click', () => {
            clientData.fullName =
                document.getElementById('profile-full-name').value;
            clientData.email = document.getElementById('profile-email').value;
            clientData.password =
                document.getElementById('profile-password').value; // Update password
            clientData.phone = document.getElementById('profile-phone').value;
            clientData.location =
                document.getElementById('profile-location').value;

            saveClientData(); // Save to localStorage
            updateSidebarUserInfo(); // Update sidebar immediately
            alert('Profile details saved successfully!'); // Use custom modal in production
            renderSection('profile'); // Re-render to show updated static text (or keep fields editable)
        });

        cancelButton.addEventListener('click', () => {
            renderSection('profile'); // Simply re-render to discard changes
        });
    }

    // --- Modal Specific Logic ---

    // Handle file upload for new consultation form
    uploadDocumentInput.addEventListener('change', (event) => {
        if (event.target.files.length > 0) {
            uploadedDocNameSpan.textContent = event.target.files[0].name;
        } else {
            uploadedDocNameSpan.textContent = '';
        }
    });

    // Handle new consultation form submission
    newConsultationForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const caseType = document.getElementById('case-type').value;
        const caseDescription =
            document.getElementById('case-description').value;
        const urgency = document.getElementById('urgency').value;
        const budget = document.getElementById('budget').value;
        const desiredExperience =
            document.getElementById('desired-experience').value;
        const desiredRating = document.getElementById('desired-rating').value;
        const uploadedFile = uploadDocumentInput.files[0];

        // Basic validation
        if (!caseType || !caseDescription || !urgency) {
            alert('Please fill in Case Type, Description, and Urgency.');
            return;
        }

        const newCaseId =
            'C-' + (userCases.length + 1).toString().padStart(3, '0');
        const newRequest = {
            id: newCaseId,
            type: caseType,
            description: caseDescription,
            urgency: urgency,
            budget: budget,
            desiredExperience: desiredExperience,
            desiredRating: desiredRating,
            lawyerName: 'Pending Assignment', // Will be assigned by lawyer
            lastUpdate: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            status: 'Pending',
            documents: []
        };

        // Simulate document upload
        if (uploadedFile) {
            const docName = uploadedFile.name;
            const docContent = `Content of ${docName} for case ${newCaseId}. (Simulated document content)`;
            newRequest.documents.push({ name: docName, content: docContent });

            userDocuments.push({
                id:
                    'DOC-' +
                    (userDocuments.length + 1).toString().padStart(3, '0'),
                name: docName,
                caseId: newCaseId,
                lawyerName: 'Pending Assignment',
                uploadDate: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                content: docContent
            });
            saveUserDocuments();
        }

        userCases.push(newRequest);
        saveUserCases();

        alert('Your consultation request has been submitted!'); // Use custom modal
        findLawyerModal.style.display = 'none';
        newConsultationForm.reset(); // Clear form
        uploadedDocNameSpan.textContent = ''; // Clear uploaded file name

        // Redirect to index.html after submission
        window.location.href = '../../project/MATCHING/templates/results.html';
    });

    // --- General Event Listeners ---

    // Sidebar navigation clicks
    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const section = link.dataset.section;
            renderSection(section);
        });
    });

    // Logout button click
    logoutButton.addEventListener('click', () => {
        alert('You have been logged out.'); // Using alert for simple demo, replace with custom modal
        // Clear all local storage for a clean logout demo
        localStorage.clear();
        // Redirect to a simple login page or reload index.html
        document.body.innerHTML =
            document.getElementById('login-page').outerHTML;
        document.getElementById('login-page').style.display = 'flex';
    });

    // Close modal buttons
    closeButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.target.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside of modal content
    window.addEventListener('click', (event) => {
        if (event.target === caseDetailModal) {
            caseDetailModal.style.display = 'none';
        }
        if (event.target === findLawyerModal) {
            findLawyerModal.style.display = 'none';
        }
    });

    // --- Global Search Functionality ---
    globalSearchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const currentActiveSection = document.querySelector(
            '.navigation ul li.active'
        ).dataset.section;

        // Dispatch a custom event to the current section to handle filtering
        const globalSearchEvent = new CustomEvent('globalSearch', {
            detail: { searchTerm: searchTerm }
        });
        contentArea.dispatchEvent(globalSearchEvent);

        // Special handling for dashboard (no direct filtering, but input is live)
        if (currentActiveSection === 'dashboard') {
            // No direct filtering needed for dashboard summary/recents, but input is active.
            // Could add logic here to highlight search results if needed.
        }
    });

    // Initial load: render Dashboard section and update sidebar user info
    updateSidebarUserInfo();
    renderSection('dashboard');
});

/*  



                                        NOW LAWYER PART




*/

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.navigation ul li');
    const currentSectionTitle = document.getElementById(
        'current-section-title'
    );
    const logoutButton = document.getElementById('logout-button');
    const globalSearchInput = document.getElementById('global-search-input'); // Global search bar

    // Sidebar elements to update
    const sidebarUserName = document.getElementById('sidebar-user-name');
    const sidebarProfilePic = document.getElementById('sidebar-profile-pic');

    // Modals
    const caseDetailModal = document.getElementById('case-detail-modal');
    const modalCaseDetails = document.getElementById('modal-case-details');
    const requestDetailModal = document.getElementById('request-detail-modal');
    const modalRequestDetails = document.getElementById(
        'modal-request-details'
    );
    const acceptRequestButton = document.getElementById(
        'accept-request-button'
    );
    const declineRequestButton = document.getElementById(
        'decline-request-button'
    );
    const documentViewModal = document.getElementById('document-view-modal');
    const modalDocumentContent = document.getElementById(
        'modal-document-content'
    );
    const documentSummaryModal = document.getElementById(
        'document-summary-modal'
    ); // New modal
    const modalDocumentSummaryContent = document.getElementById(
        'modal-document-summary-content'
    );
    const summaryLoadingIndicator = document.getElementById(
        'summary-loading-indicator'
    );
    const addTaskModal = document.getElementById('add-task-modal');
    const newTaskInput = document.getElementById('new-task-input');
    const saveTaskButton = document.getElementById('save-task-button');
    const editTaskModal = document.getElementById('edit-task-modal');
    const editTaskId = document.getElementById('edit-task-id');
    const editTaskInput = document.getElementById('edit-task-input');
    const updateTaskButton = document.getElementById('update-task-button');
    const removeTaskButton = document.getElementById('remove-task-button');
    const editScheduleModal = document.getElementById('edit-schedule-modal');
    const editScheduleId = document.getElementById('edit-schedule-id');
    const editScheduleTime = document.getElementById('edit-schedule-time');
    const editScheduleTitle = document.getElementById('edit-schedule-title');
    const editScheduleDescription = document.getElementById(
        'edit-schedule-description'
    );
    const editScheduleDate = document.getElementById('edit-schedule-date');
    const saveScheduleButton = document.getElementById('save-schedule-button');
    const deleteScheduleButton = document.getElementById(
        'delete-schedule-button'
    );
    const closeButtons = document.querySelectorAll('.close-button');

    // --- Sample Data (Replace with actual data fetched from a backend) ---
    // Lawyer's own profile data
    let lawyerData = JSON.parse(localStorage.getItem('lawyerData')) || {
        fullName: 'Anupam',
        email: 'anupam.lawyer@example.com',
        password: 'password123', // Dummy password
        phone: '+91 98765 43210',
        specialization: 'Family Law',
        yearsOfExperience: 10,
        location: 'Bengaluru, Karnataka',
        bio: 'Experienced family law attorney with a passion for helping clients navigate complex legal challenges with compassion and expertise.',
        profilePic: 'https://placehold.co/50x50/e0e0e0/333333?text=Lawyer'
    };

    // Cases requested by users (pending acceptance/decline)
    // This data would come from the client dashboard's 'pendingLawyerRequests'
    let caseRequests = JSON.parse(
        localStorage.getItem('pendingLawyerRequests')
    ) || [
        {
            id: 'LR-001',
            caseId: 'C-004',
            clientName: 'Alice Johnson',
            type: 'Divorce',
            requestDate: 'Jun 15, 2024',
            description:
                'Seeking legal representation for a divorce case. My spouse and I have agreed on most terms, but need assistance with property division and child custody arrangements for our two children. We are looking for an amicable resolution.',
            documents: [
                {
                    name: 'Marriage Certificate.pdf',
                    content:
                        'Scan of marriage certificate. This document confirms the legal union and is essential for divorce proceedings. It includes names, date, and place of marriage.'
                },
                {
                    name: 'Property List.xlsx',
                    content:
                        'Spreadsheet of shared properties. This document details all jointly owned assets, including real estate, vehicles, and financial accounts, with estimated values. Used for equitable distribution.'
                }
            ]
        },
        {
            id: 'LR-002',
            caseId: 'C-005',
            clientName: 'Bob Williams',
            type: 'Property Dispute',
            requestDate: 'Jun 14, 2024',
            description:
                'I have a dispute with my neighbor over property boundaries. We have tried to resolve it amicably but failed. I need advice on legal options and potential litigation.',
            documents: [
                {
                    name: 'Property Survey.pdf',
                    content:
                        'Official land survey document. This document provides precise measurements and boundaries of the property, crucial for resolving disputes. It may include topographical details and easements.'
                }
            ]
        }
    ];

    // Cases accepted by the lawyer
    let lawyerCases = JSON.parse(localStorage.getItem('lawyerCases')) || [
        {
            id: 'C-1023',
            clientName: 'Sarah Johnson',
            type: 'Divorce',
            status: 'Active',
            lastUpdate: 'Jun 12, 2023',
            details:
                'Initial consultation completed. Documents for divorce petition drafted and awaiting client review. Next hearing scheduled for July 15, 2024. Please provide any additional evidence or information.',
            documents: [
                {
                    name: 'Divorce Petition Draft.pdf',
                    content:
                        'This is the draft of the divorce petition. It outlines the grounds for divorce, proposed division of assets, and child custody arrangements. Please review carefully and provide feedback on any sections that require modification. Ensure all personal details are accurate.'
                }
            ]
        },
        {
            id: 'C-1022',
            clientName: 'Michael Rodriguez',
            type: 'Property Dispute',
            status: 'Pending',
            lastUpdate: 'Jun 10, 2023',
            details:
                'Property inspection scheduled for June 18, 2024. Loan application submitted and pending approval. Title search initiated. All necessary permits are being acquired.',
            documents: [
                {
                    name: 'Property Deed.jpg',
                    content:
                        'This image is a scan of the property deed for the new house. It includes the legal description of the property, previous ownership details, and registration information. Verify all details match your records.'
                }
            ]
        },
        {
            id: 'C-1021',
            clientName: 'Emily Wilson',
            type: 'Child Custody',
            status: 'Active',
            lastUpdate: 'Jun 8, 2023',
            details:
                "Mediation sessions ongoing. Preparing for court if an agreement is not reached. Focus on child's best interest. Gathering school and medical records.",
            documents: []
        },
        {
            id: 'C-1020',
            clientName: 'David Thompson',
            type: 'Contract Review',
            status: 'Completed',
            lastUpdate: 'Jun 5, 2023',
            details:
                'Contract reviewed, amendments suggested, and finalized. Client satisfied with terms. Case closed.',
            documents: [
                {
                    name: 'Contract Review Report.pdf',
                    content: 'Detailed report of contract review findings.'
                }
            ]
        }
    ];

    // Clients associated with the lawyer
    let clientsData = JSON.parse(localStorage.getItem('clientsData')) || [
        {
            id: 'CL-001',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            phone: '111-222-3333',
            profilePic: 'https://placehold.co/45x45/e0e0e0/333333?text=SJ',
            associatedCases: ['C-1023']
        },
        {
            id: 'CL-002',
            name: 'Michael Rodriguez',
            email: 'michael.r@example.com',
            phone: '444-555-6666',
            profilePic: 'https://placehold.co/45x45/e0e0e0/333333?text=MR',
            associatedCases: ['C-1022']
        },
        {
            id: 'CL-003',
            name: 'Emily Wilson',
            email: 'emily.w@example.com',
            phone: '777-888-9999',
            profilePic: 'https://placehold.co/45x45/e0e0e0/333333?text=EW',
            associatedCases: ['C-1021']
        },
        {
            id: 'CL-004',
            name: 'David Thompson',
            email: 'david.t@example.com',
            phone: '000-111-2222',
            profilePic: 'https://placehold.co/45x45/e0e0e0/333333?text=DT',
            associatedCases: ['C-1020']
        }
    ];

    // Lawyer's schedule
    let scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || [
        {
            id: 'SCH-001',
            time: '09:00',
            title: 'Client Meeting',
            description: 'Sarah Johnson - Divorce Case',
            date: '2025-05-28'
        },
        {
            id: 'SCH-002',
            time: '11:30',
            title: 'Court Hearing',
            description: 'Rodriguez v. Smith Property Dispute',
            date: '2025-05-28'
        },
        {
            id: 'SCH-003',
            time: '14:00',
            title: 'Document Review',
            description: 'Wilson Custody Agreement',
            date: '2025-05-28'
        },
        {
            id: 'SCH-004',
            time: '16:30',
            title: 'Team Meeting',
            description: 'Weekly Case Review',
            date: '2025-05-28'
        },
        {
            id: 'SCH-005',
            time: '10:00',
            title: 'Client Call',
            description: 'New client consultation - potential property case',
            date: '2025-05-29'
        },
        {
            id: 'SCH-006',
            time: '15:00',
            title: 'Research Session',
            description: 'Research on intellectual property law',
            date: '2025-05-29'
        }
    ];

    // Lawyer's tasks (to-do list)
    let tasksData = JSON.parse(localStorage.getItem('tasksData')) || [
        {
            id: 'TASK-001',
            text: 'Prepare documents for Johnson case',
            completed: false,
            dueDate: 'Today'
        },
        {
            id: 'TASK-002',
            text: 'Call Rodriguez about property inspection',
            completed: false,
            dueDate: 'Today'
        },
        {
            id: 'TASK-003',
            text: 'Review Wilson custody agreement',
            completed: false,
            dueDate: 'Today'
        },
        {
            id: 'TASK-004',
            text: 'Send invoice to Thompson',
            completed: false,
            dueDate: 'Jun 15'
        },
        {
            id: 'TASK-005',
            text: 'Prepare for court hearing (Rodriguez)',
            completed: false,
            dueDate: 'Jun 16'
        }
    ];

    // Messages data, indexed by client name
    let messagesData = JSON.parse(localStorage.getItem('messagesData')) || {
        'Sarah Johnson': [
            {
                sender: 'Sarah Johnson',
                message:
                    'Hi Anupam, just checking in on the divorce petition draft. Is it ready for my review?',
                time: '2025-05-28T09:00:00',
                type: 'received'
            },
            {
                sender: 'You',
                message:
                    "Hi Sarah, yes, it's ready. I've uploaded it to your documents section. Please review and let me know your thoughts.",
                time: '2025-05-28T09:05:00',
                type: 'sent'
            }
        ],
        'Michael Rodriguez': [
            {
                sender: 'Michael Rodriguez',
                message:
                    'Good morning, Anupam. Any updates on the property inspection for my case?',
                time: '2025-05-27T14:30:00',
                type: 'received'
            },
            {
                sender: 'You',
                message:
                    "Good morning, Michael. The inspection is scheduled for tomorrow, June 18th. I'll update you as soon as I have the report.",
                time: '2025-05-27T14:35:00',
                type: 'sent'
            }
        ],
        'Emily Wilson': [
            {
                sender: 'Emily Wilson',
                message:
                    "Anupam, I'm feeling a bit anxious about the mediation. Can we discuss the strategy again?",
                time: '2025-05-26T10:00:00',
                type: 'received'
            },
            {
                sender: 'You',
                message:
                    "Of course, Emily. Let's schedule a quick call for tomorrow morning. I'll send you an invite.",
                time: '2025-05-26T10:05:00',
                type: 'sent'
            }
        ],
        // New request from Alice Johnson (from client dashboard)
        'Alice Johnson': [
            {
                sender: 'Alice Johnson',
                message:
                    'Hello, I submitted a divorce case request (REQ-001) through the portal. Hope to hear from you soon!',
                time: '2025-06-01T10:00:00',
                type: 'received'
            }
        ]
    };

    // Documents uploaded by clients to the lawyer
    let lawyerDocuments = JSON.parse(
        localStorage.getItem('lawyerDocuments')
    ) || [
        {
            id: 'LDOC-001',
            name: 'Johnson_Marriage_Cert.pdf',
            clientName: 'Sarah Johnson',
            type: 'PDF',
            uploadDate: 'Jun 10, 2023',
            caseId: 'C-1023',
            content:
                "This is a scanned copy of Sarah Johnson's marriage certificate, uploaded for the divorce case (C-1023). It confirms the date and place of marriage."
        },
        {
            id: 'LDOC-002',
            name: 'Rodriguez_Property_Survey.jpg',
            clientName: 'Michael Rodriguez',
            type: 'JPEG',
            uploadDate: 'May 20, 2023',
            caseId: 'C-1022',
            content:
                "This image is a scanned copy of the property survey for Michael Rodriguez's property dispute case (C-1022). It outlines the exact boundaries and dimensions of the land."
        },
        {
            id: 'LDOC-003',
            name: 'Wilson_School_Records.pdf',
            clientName: 'Emily Wilson',
            type: 'PDF',
            uploadDate: 'Jun 01, 2024',
            caseId: 'C-1021',
            content:
                "These are the school records for Emily Wilson's children, relevant to the child custody case (C-1021). Includes attendance, grades, and extracurricular activities."
        },
        // Documents from pending requests (simulated)
        {
            id: 'LDOC-004',
            name: 'Alice_Marriage_Cert.pdf',
            clientName: 'Alice Johnson',
            type: 'PDF',
            uploadDate: 'Jun 15, 2024',
            caseId: 'C-004',
            content:
                "Scan of marriage certificate for Alice Johnson's divorce case. This document confirms the legal union and is essential for divorce proceedings. It includes names, date, and place of marriage."
        },
        {
            id: 'LDOC-005',
            name: 'Alice_Property_List.xlsx',
            clientName: 'Alice Johnson',
            type: 'XLSX',
            uploadDate: 'Jun 15, 2024',
            caseId: 'C-004',
            content:
                "Spreadsheet of shared properties for Alice Johnson's divorce case. This document details all jointly owned assets, including real estate, vehicles, and financial accounts, with estimated values. Used for equitable distribution."
        },
        {
            id: 'LDOC-006',
            name: 'Bob_Property_Survey.pdf',
            clientName: 'Bob Williams',
            type: 'PDF',
            uploadDate: 'Jun 14, 2024',
            caseId: 'C-005',
            content:
                "Official land survey document for Bob Williams' property dispute case. This document provides precise measurements and boundaries of the property, crucial for resolving disputes. It may include topographical details and easements."
        }
    ];

    let currentOpenClientForMessages = null; // Tracks which client's chat is open
    let currentDocumentFilterCaseId = null; // Tracks which case's documents are being viewed
    let currentDocumentFilterClientName = null; // Tracks which client's documents are being viewed

    // --- Local Storage Sync Functions ---
    function saveLawyerData() {
        localStorage.setItem('lawyerData', JSON.stringify(lawyerData));
    }
    function saveCaseRequests() {
        localStorage.setItem(
            'pendingLawyerRequests',
            JSON.stringify(caseRequests)
        );
    } // Save to pendingLawyerRequests
    function saveLawyerCases() {
        localStorage.setItem('lawyerCases', JSON.stringify(lawyerCases));
    }
    function saveClientsData() {
        localStorage.setItem('clientsData', JSON.stringify(clientsData));
    }
    function saveScheduleData() {
        localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    }
    function saveTasksData() {
        localStorage.setItem('tasksData', JSON.stringify(tasksData));
    }
    function saveMessagesData() {
        localStorage.setItem('messagesData', JSON.stringify(messagesData));
    }
    function saveLawyerDocuments() {
        localStorage.setItem(
            'lawyerDocuments',
            JSON.stringify(lawyerDocuments)
        );
    }

    // --- Helper Functions ---

    // Function to get client profile picture URL
    function getClientProfilePic(clientName) {
        const client = clientsData.find((c) => c.name === clientName);
        return client
            ? client.profilePic
            : 'https://placehold.co/45x45/e0e0e0/333333?text=C'; // Default placeholder
    }

    // Function to update sidebar user info
    function updateSidebarUserInfo() {
        sidebarUserName.textContent = lawyerData.fullName;
        sidebarProfilePic.src = lawyerData.profilePic;
    }

    // Function to render sections
    function renderSection(sectionName, data = {}) {
        globalSearchInput.value = ''; // Clear global search when navigating
        contentArea.innerHTML = ''; // Clear previous content
        currentSectionTitle.textContent = sectionName
            .replace('-', ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '); // Capitalize and format title

        // Update active navigation link
        navLinks.forEach((link) => link.classList.remove('active'));
        document
            .querySelector(`.navigation ul li[data-section="${sectionName}"]`)
            .classList.add('active');

        switch (sectionName) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'cases':
                renderCases();
                break;
            case 'clients':
                renderClients();
                break;
            case 'calendar':
                renderCalendar();
                break;
            case 'messages':
                renderMessages(data.clientName); // Pass client name if coming from "Contact"
                break;
            case 'documents':
                renderMyDocuments(data.caseId, data.clientName); // Pass caseId or clientName for filtering documents
                break;
            case 'profile':
                renderProfile();
                break;
            default:
                contentArea.innerHTML =
                    '<h2 class="section-header">Page Not Found</h2><p>The requested section does not exist.</p>';
        }
    }

    // --- Section Render Functions ---

    function renderDashboard() {
        // Calculate summary data
        const activeCasesCount = lawyerCases.filter(
            (c) => c.status === 'Active' || c.status === 'Pending'
        ).length;
        const totalClientsCount = clientsData.length;
        const upcomingCasesCount = scheduleData.filter(
            (s) => new Date(s.date) >= new Date() && s.title.includes('Case')
        ).length; // Simple filter for demo

        let dashboardHtml = `
            <h2 class="section-header">Dashboard</h2>
            <div class="dashboard-summary-grid">
                <div class="summary-card">
                    <i class="fas fa-briefcase icon"></i>
                    <div class="value">${activeCasesCount}</div>
                    <div class="label">Active Cases</div>
                </div>
                <div class="summary-card">
                    <i class="fas fa-users icon"></i>
                    <div class="value">${totalClientsCount}</div>
                    <div class="label">Total Clients</div>
                </div>
                <div class="summary-card">
                    <i class="fas fa-calendar-check icon"></i>
                    <div class="value">${upcomingCasesCount}</div>
                    <div class="label">Upcoming Cases</div>
                </div>
            </div>

            <div class="dashboard-section-card">
                <div class="dashboard-section-header">
                    <h3>Recent Cases</h3>
                    <button class="view-all-button" data-target-section="cases">View All</button>
                </div>
                <table class="recent-cases-table">
                    <thead>
                        <tr>
                            <th>Case ID</th>
                            <th>Client</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Last Update</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        // Display top 4 recent cases
        lawyerCases.slice(0, 4).forEach((caseItem) => {
            const statusClass =
                caseItem.status === 'Active'
                    ? 'status-active'
                    : caseItem.status === 'Pending'
                    ? 'status-pending'
                    : 'status-completed';
            dashboardHtml += `
                <tr>
                    <td>${caseItem.id}</td>
                    <td>${caseItem.clientName}</td>
                    <td>${caseItem.type}</td>
                    <td><span class="${statusClass}">${caseItem.status}</span></td>
                    <td>${caseItem.lastUpdate}</td>
                </tr>
            `;
        });
        dashboardHtml += `
                    </tbody>
                </table>
            </div>

            <div class="dashboard-section-card">
                <div class="dashboard-section-header">
                    <h3>Today's Schedule</h3>
                    <button class="view-calendar-button" data-target-section="calendar">Full Calendar</button>
                </div>
                <div class="schedule-list">
        `;
        const today = new Date().toISOString().slice(0, 10); //YYYY-MM-DD
        const todaySchedule = scheduleData.filter((s) => s.date === today);
        if (todaySchedule.length > 0) {
            todaySchedule
                .sort((a, b) => a.time.localeCompare(b.time))
                .forEach((item) => {
                    dashboardHtml += `
                    <div class="schedule-item">
                        <div class="schedule-time">${item.time}</div>
                        <div class="schedule-title">${item.title}</div>
                        <div class="schedule-description">${item.description}</div>
                    </div>
                `;
                });
        } else {
            dashboardHtml += '<p>No schedule entries for today.</p>';
        }
        dashboardHtml += `
                </div>
            </div>

            <div class="dashboard-section-card">
                <div class="dashboard-section-header">
                    <h3>To-Do List</h3>
                    <button class="add-task-button">Add Task</button>
                </div>
                <div class="task-list">
                    <ul id="dashboard-task-list">
        `;
        tasksData.forEach((task) => {
            const completedClass = task.completed ? 'completed' : '';
            dashboardHtml += `
                <li>
                    <input type="checkbox" data-task-id="${task.id}" ${
                task.completed ? 'checked' : ''
            }>
                    <span class="task-text ${completedClass}">${
                task.text
            }</span>
                    <span class="task-date">${task.dueDate}</span>
                    <div class="task-actions">
                        <button class="edit-task-button" data-task-id="${
                            task.id
                        }"><i class="fas fa-pencil-alt"></i></button>
                    </div>
                </li>
            `;
        });
        dashboardHtml += `
                    </ul>
                </div>
            </div>
        `;
        contentArea.innerHTML = dashboardHtml;

        // Add event listeners for dashboard buttons
        contentArea
            .querySelector('.view-all-button')
            .addEventListener('click', () => renderSection('cases'));
        contentArea
            .querySelector('.view-calendar-button')
            .addEventListener('click', () => renderSection('calendar'));
        contentArea
            .querySelector('.add-task-button')
            .addEventListener(
                'click',
                () => (addTaskModal.style.display = 'flex')
            );

        // Task checkbox listener
        contentArea
            .querySelectorAll('#dashboard-task-list input[type="checkbox"]')
            .forEach((checkbox) => {
                checkbox.addEventListener('change', (event) => {
                    const taskId = event.target.dataset.taskId;
                    const task = tasksData.find((t) => t.id === taskId);
                    if (task) {
                        task.completed = event.target.checked;
                        saveTasksData();
                        renderDashboard(); // Re-render to update UI
                    }
                });
            });

        // Task edit button listener
        contentArea.querySelectorAll('.edit-task-button').forEach((button) => {
            button.addEventListener('click', (event) => {
                const taskId = event.target.dataset.taskId;
                const task = tasksData.find((t) => t.id === taskId);
                if (task) {
                    editTaskId.value = task.id;
                    editTaskInput.value = task.text;
                    editTaskModal.style.display = 'flex';
                }
            });
        });
    }

    function renderCases() {
        let casesHtml = `
            <h2 class="section-header">Cases</h2>
            <div class="cases-tabs">
                <button class="cases-tab-button active" data-tab="requests">Requests from Users (${caseRequests.length})</button>
                <button class="cases-tab-button" data-tab="my-cases">My Cases (${lawyerCases.length})</button>
            </div>
            <div id="cases-content-area" class="cases-content-area">
                </div>
        `;
        contentArea.innerHTML = casesHtml;

        const casesContentArea = document.getElementById('cases-content-area');
        const casesTabButtons =
            contentArea.querySelectorAll('.cases-tab-button');

        let currentCasesTab = 'requests'; // Keep track of the active tab for search filtering

        function renderCasesTab(tabName, searchTerm = '') {
            currentCasesTab = tabName; // Update active tab
            casesTabButtons.forEach((btn) => btn.classList.remove('active'));
            document
                .querySelector(`.cases-tab-button[data-tab="${tabName}"]`)
                .classList.add('active');
            casesContentArea.innerHTML = ''; // Clear tab content

            if (tabName === 'requests') {
                let filteredRequests = caseRequests.filter(
                    (req) =>
                        req.clientName.toLowerCase().includes(searchTerm) ||
                        req.caseId.toLowerCase().includes(searchTerm) ||
                        req.type.toLowerCase().includes(searchTerm)
                );

                let requestsTableHtml = `
                    <h3>Pending Case Requests</h3>
                    <table class="request-table">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Client Name</th>
                                <th>Type</th>
                                <th>Request Date</th>
                                <th>Documents</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                if (filteredRequests.length > 0) {
                    filteredRequests.forEach((req) => {
                        const documentInfo =
                            req.documents && req.documents.length > 0
                                ? req.documents
                                      .map((doc) => doc.name)
                                      .join(', ')
                                : 'None';
                        requestsTableHtml += `
                            <tr>
                                <td>${req.id}</td>
                                <td>${req.clientName}</td>
                                <td>${req.type}</td>
                                <td>${req.requestDate}</td>
                                <td>${documentInfo}</td>
                                <td>
                                    <button class="view-request-button" data-request-id="${
                                        req.id
                                    }">View</button>
                                    ${
                                        req.documents &&
                                        req.documents.length > 0
                                            ? `
                                        <button class="view-document-request-button" data-request-id="${req.id}" data-document-index="0">View Doc</button>
                                        <button class="summarize-document-button" data-request-id="${req.id}" data-document-index="0">Summarize</button>
                                    `
                                            : ''
                                    }
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    requestsTableHtml += `<tr><td colspan="6">No pending case requests matching "${searchTerm}".</td></tr>`;
                }
                requestsTableHtml += `
                        </tbody>
                    </table>
                `;
                casesContentArea.innerHTML = requestsTableHtml;

                // Add event listeners for "View" buttons in requests
                casesContentArea
                    .querySelectorAll('.view-request-button')
                    .forEach((button) => {
                        button.addEventListener('click', (event) => {
                            const requestId = event.target.dataset.requestId;
                            const requestDetails = caseRequests.find(
                                (r) => r.id === requestId
                            );
                            if (requestDetails) {
                                modalRequestDetails.innerHTML = `
                                <p><strong>Request ID:</strong> ${
                                    requestDetails.id
                                }</p>
                                <p><strong>Client:</strong> ${
                                    requestDetails.clientName
                                }</p>
                                <p><strong>Type:</strong> ${
                                    requestDetails.type
                                }</p>
                                <p><strong>Request Date:</strong> ${
                                    requestDetails.requestDate
                                }</p>
                                <p><strong>Description:</strong> ${
                                    requestDetails.description
                                }</p>
                                <p><strong>Documents:</strong> ${
                                    requestDetails.documents
                                        .map((d) => d.name)
                                        .join(', ') || 'None'
                                }</p>
                            `;
                                requestDetailModal.style.display = 'flex';
                                // Store the current request ID for accept/decline buttons
                                requestDetailModal.dataset.currentRequestId =
                                    requestId;
                            }
                        });
                    });

                // Add event listeners for "View Doc" buttons in requests
                casesContentArea
                    .querySelectorAll('.view-document-request-button')
                    .forEach((button) => {
                        button.addEventListener('click', (event) => {
                            const requestId = event.target.dataset.requestId;
                            const docIndex = parseInt(
                                event.target.dataset.documentIndex
                            );
                            const requestDetails = caseRequests.find(
                                (r) => r.id === requestId
                            );
                            if (
                                requestDetails &&
                                requestDetails.documents &&
                                requestDetails.documents[docIndex]
                            ) {
                                const doc = requestDetails.documents[docIndex];
                                modalDocumentContent.innerHTML = `
                                <h3>${doc.name}</h3>
                                <p><strong>Client:</strong> ${requestDetails.clientName}</p>
                                <p><strong>Case Type:</strong> ${requestDetails.type}</p>
                                <hr>
                                <p>${doc.content}</p>
                            `;
                                documentViewModal.style.display = 'flex';
                            } else {
                                alert('Document not found.'); // Use custom modal
                            }
                        });
                    });

                // Add event listeners for "Summarize" buttons in requests
                casesContentArea
                    .querySelectorAll('.summarize-document-button')
                    .forEach((button) => {
                        button.addEventListener('click', async (event) => {
                            const requestId = event.target.dataset.requestId;
                            const docIndex = parseInt(
                                event.target.dataset.documentIndex
                            );
                            const requestDetails = caseRequests.find(
                                (r) => r.id === requestId
                            );

                            if (
                                requestDetails &&
                                requestDetails.documents &&
                                requestDetails.documents[docIndex]
                            ) {
                                const doc = requestDetails.documents[docIndex];
                                documentSummaryModal.style.display = 'flex';
                                summaryLoadingIndicator.style.display = 'block';
                                modalDocumentSummaryContent.innerHTML =
                                    '<p id="summary-loading-indicator" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Generating summary...</p>';

                                try {
                                    const prompt = `Summarize the following document content: "${doc.content}"`;
                                    let chatHistory = [];
                                    chatHistory.push({
                                        role: 'user',
                                        parts: [{ text: prompt }]
                                    });
                                    const payload = { contents: chatHistory };
                                    const apiKey = ''; // Canvas will provide this at runtime
                                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                                    const response = await fetch(apiUrl, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(payload)
                                    });
                                    const result = await response.json();

                                    summaryLoadingIndicator.style.display =
                                        'none'; // Hide loading indicator

                                    if (
                                        result.candidates &&
                                        result.candidates.length > 0 &&
                                        result.candidates[0].content &&
                                        result.candidates[0].content.parts &&
                                        result.candidates[0].content.parts
                                            .length > 0
                                    ) {
                                        const summary =
                                            result.candidates[0].content
                                                .parts[0].text;
                                        modalDocumentSummaryContent.innerHTML = `<h3>Summary of ${doc.name}</h3><p>${summary}</p>`;
                                    } else {
                                        modalDocumentSummaryContent.innerHTML = `<p>Could not generate summary for ${doc.name}.</p>`;
                                    }
                                } catch (error) {
                                    console.error(
                                        'Error summarizing document:',
                                        error
                                    );
                                    summaryLoadingIndicator.style.display =
                                        'none';
                                    modalDocumentSummaryContent.innerHTML = `<p>Error generating summary. Please try again.</p>`;
                                }
                            } else {
                                alert(
                                    'Document not found or no content to summarize.'
                                ); // Use custom modal
                            }
                        });
                    });
            } else if (tabName === 'my-cases') {
                let filteredMyCases = lawyerCases.filter(
                    (caseItem) =>
                        caseItem.clientName
                            .toLowerCase()
                            .includes(searchTerm) ||
                        caseItem.id.toLowerCase().includes(searchTerm) ||
                        caseItem.type.toLowerCase().includes(searchTerm)
                );

                let myCasesTableHtml = `
                    <h3>My Accepted Cases</h3>
                    <table class="my-cases-table">
                        <thead>
                            <tr>
                                <th>Case ID</th>
                                <th>Client</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Last Update</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                if (filteredMyCases.length > 0) {
                    filteredMyCases.forEach((caseItem) => {
                        const statusClass =
                            caseItem.status === 'Active'
                                ? 'status-active'
                                : caseItem.status === 'Pending'
                                ? 'status-pending'
                                : 'status-completed';
                        myCasesTableHtml += `
                            <tr>
                                <td>${caseItem.id}</td>
                                <td>${caseItem.clientName}</td>
                                <td>${caseItem.type}</td>
                                <td><span class="${statusClass}">${caseItem.status}</span></td>
                                <td>${caseItem.lastUpdate}</td>
                                <td><button class="view-button" data-case-id="${caseItem.id}">View</button></td>
                            </tr>
                        `;
                    });
                } else {
                    myCasesTableHtml += `<tr><td colspan="6">No accepted cases matching "${searchTerm}".</td></tr>`;
                }
                myCasesTableHtml += `
                        </tbody>
                    </table>
                `;
                casesContentArea.innerHTML = myCasesTableHtml;

                // Add event listeners for "View" buttons in my-cases
                casesContentArea
                    .querySelectorAll('.view-button')
                    .forEach((button) => {
                        button.addEventListener('click', (event) => {
                            const caseId = event.target.dataset.caseId;
                            const caseDetails = lawyerCases.find(
                                (c) => c.id === caseId
                            );
                            if (caseDetails) {
                                modalCaseDetails.innerHTML = `
                                <p><strong>Case ID:</strong> ${
                                    caseDetails.id
                                }</p>
                                <p><strong>Client:</strong> ${
                                    caseDetails.clientName
                                }</p>
                                <p><strong>Type:</strong> ${
                                    caseDetails.type
                                }</p>
                                <p><strong>Status:</strong> <span class="${
                                    caseDetails.status === 'Active'
                                        ? 'status-active'
                                        : caseDetails.status === 'Pending'
                                        ? 'status-pending'
                                        : 'status-completed'
                                }">${caseDetails.status}</span></p>
                                <p><strong>Last Update:</strong> ${
                                    caseDetails.lastUpdate
                                }</p>
                                <p><strong>Details:</strong> ${
                                    caseDetails.details
                                }</p>
                                <p><strong>Documents:</strong> ${
                                    caseDetails.documents
                                        .map((d) => d.name)
                                        .join(', ') || 'None'
                                }</p>
                            `;
                                caseDetailModal.style.display = 'flex'; // Show modal
                            }
                        });
                    });
            }
        }

        // Event listeners for case tab buttons
        casesTabButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const tabName = event.target.dataset.tab;
                renderCasesTab(tabName, globalSearchInput.value.toLowerCase()); // Pass current search term
            });
        });

        // Initial render of the 'requests' tab
        renderCasesTab('requests', globalSearchInput.value.toLowerCase());

        // Attach a custom event listener for global search
        contentArea.addEventListener('globalSearch', (event) => {
            renderCasesTab(currentCasesTab, event.detail.searchTerm);
        });
    }

    function renderClients() {
        let clientsHtml = '<h2 class="section-header">Clients</h2>';
        clientsHtml += `
            <div class="client-search-bar">
                <input type="text" placeholder="Search client by name or case ID..." id="client-search-input">
                <i class="fas fa-search"></i>
            </div>
            <div class="client-cards">
        `;
        clientsHtml += `
            </div>
        `;
        contentArea.innerHTML = clientsHtml;

        const clientSearchInput = document.getElementById(
            'client-search-input'
        );
        const clientCardsContainer = contentArea.querySelector('.client-cards');

        function displayClients(searchTerm = '') {
            clientCardsContainer.innerHTML = ''; // Clear existing cards
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            const filteredClients = clientsData.filter((client) => {
                const matchesName = client.name
                    .toLowerCase()
                    .includes(lowerCaseSearchTerm);
                const matchesCaseId = client.associatedCases.some((caseId) =>
                    caseId.toLowerCase().includes(lowerCaseSearchTerm)
                );
                return matchesName || matchesCaseId;
            });

            if (filteredClients.length > 0) {
                filteredClients.forEach((client) => {
                    const clientCard = document.createElement('div');
                    clientCard.classList.add('client-card');
                    clientCard.innerHTML = `
                        <img src="${client.profilePic}" alt="${
                        client.name
                    } Profile" class="client-profile-pic">
                        <h3>${client.name}</h3>
                        <p>Email: <a href="mailto:${client.email}">${
                        client.email
                    }</a></p>
                        <p>Phone: ${client.phone}</p>
                        <p>Cases: ${
                            client.associatedCases.join(', ') || 'None'
                        }</p>
                        <div class="client-actions">
                            <button class="contact-button" data-client-name="${
                                client.name
                            }">Contact</button>
                            <button class="details-button" data-client-name="${
                                client.name
                            }">Documents</button>
                        </div>
                    `;
                    clientCardsContainer.appendChild(clientCard);
                });
            } else {
                clientCardsContainer.innerHTML = `<p style="text-align: center; width: 100%;">No clients found matching "${searchTerm}".</p>`;
            }

            // Add event listeners for "Contact" buttons
            clientCardsContainer
                .querySelectorAll('.contact-button')
                .forEach((button) => {
                    button.addEventListener('click', (event) => {
                        const clientName = event.target.dataset.clientName;
                        renderSection('messages', { clientName: clientName });
                    });
                });

            // Add event listeners for "Documents" buttons
            clientCardsContainer
                .querySelectorAll('.details-button')
                .forEach((button) => {
                    button.addEventListener('click', (event) => {
                        const clientName = event.target.dataset.clientName;
                        renderSection('documents', { clientName: clientName }); // Redirect to documents, filtered by client
                    });
                });
        }

        // Initial display of clients
        displayClients(globalSearchInput.value.toLowerCase());

        // Event listener for client-specific search input
        clientSearchInput.addEventListener('input', (event) => {
            displayClients(event.target.value.toLowerCase());
        });

        // Attach a custom event listener for global search
        contentArea.addEventListener('globalSearch', (event) => {
            clientSearchInput.value = event.detail.searchTerm; // Update local search bar
            displayClients(event.detail.searchTerm);
        });
    }

    function renderCalendar() {
        let calendarHtml = `
            <h2 class="section-header">Calendar & Schedule</h2>
            <div class="calendar-container">
                <div class="dashboard-section-header">
                    <h3>All Schedule Entries</h3>
                    <button class="add-schedule-button save-button">Add New Entry</button>
                </div>
                <div class="calendar-list">
                    <ul id="full-schedule-list">
        `;
        // Sort schedule by date then time
        const sortedSchedule = [...scheduleData].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA - dateB;
            }
            return a.time.localeCompare(b.time);
        });

        if (sortedSchedule.length > 0) {
            sortedSchedule.forEach((item) => {
                calendarHtml += `
                    <li data-schedule-id="${item.id}">
                        <div class="calendar-item-details">
                            <div class="time">${item.time} (${item.date})</div>
                            <div class="title">${item.title}</div>
                            <div class="description">${item.description}</div>
                        </div>
                        <div class="calendar-item-actions">
                            <button class="edit-schedule-button" data-schedule-id="${item.id}">Edit</button>
                        </div>
                    </li>
                `;
            });
        } else {
            calendarHtml += `<li>No schedule entries found.</li>`;
        }
        calendarHtml += `
                    </ul>
                </div>
            </div>
        `;
        contentArea.innerHTML = calendarHtml;

        // Add event listener for "Add New Entry" button
        contentArea
            .querySelector('.add-schedule-button')
            .addEventListener('click', () => {
                // Clear fields for new entry
                editScheduleId.value = '';
                editScheduleTime.value = '';
                editScheduleTitle.value = '';
                editScheduleDescription.value = '';
                editScheduleDate.value = ''; // Clear date for new entry
                deleteScheduleButton.style.display = 'none'; // Hide delete for new entry
                editScheduleModal.style.display = 'flex';
            });

        // Add event listeners for "Edit" buttons
        contentArea
            .querySelectorAll('.edit-schedule-button')
            .forEach((button) => {
                button.addEventListener('click', (event) => {
                    const scheduleId = event.target.dataset.scheduleId;
                    const scheduleItem = scheduleData.find(
                        (s) => s.id === scheduleId
                    );
                    if (scheduleItem) {
                        editScheduleId.value = scheduleItem.id;
                        editScheduleTime.value = scheduleItem.time;
                        editScheduleTitle.value = scheduleItem.title;
                        editScheduleDescription.value =
                            scheduleItem.description;
                        editScheduleDate.value = scheduleItem.date; // Set date for editing
                        deleteScheduleButton.style.display = 'inline-block'; // Show delete for existing entry
                        editScheduleModal.style.display = 'flex';
                    }
                });
            });
    }

    function renderMessages(selectedClientName = null) {
        let messagesHtml = '<h2 class="section-header">Messages</h2>';
        messagesHtml += `
            <div class="messages-container">
                <div class="message-list">
                    </div>
                <div class="message-chat-area">
                    <div class="chat-header">
                        <img src="https://placehold.co/40x40/e0e0e0/333333?text=C" alt="Client Profile" class="profile-pic" id="chat-client-profile-pic">
                        <span id="chat-client-name">Select a chat</span>
                    </div>
                    <div class="chat-messages" id="chat-messages-container">
                        </div>
                    <div class="message-input-area">
                        <input type="text" id="message-input" placeholder="Type a message...">
                        <button id="send-message-button"><i class="fas fa-paper-plane"></i> Send</button>
                    </div>
                </div>
            </div>
        `;
        contentArea.innerHTML = messagesHtml;

        const messageListDiv = contentArea.querySelector('.message-list');
        const chatMessagesContainer = contentArea.querySelector(
            '#chat-messages-container'
        );
        const chatClientNameSpan =
            contentArea.querySelector('#chat-client-name');
        const chatClientProfilePic = contentArea.querySelector(
            '#chat-client-profile-pic'
        );
        const messageInput = contentArea.querySelector('#message-input');
        const sendMessageButton = contentArea.querySelector(
            '#send-message-button'
        );

        function loadMessageList() {
            messageListDiv.innerHTML = ''; // Clear existing list
            // Get all client names from clientsData
            const allClientNames = new Set(clientsData.map((c) => c.name));
            // Add client names from messagesData that might not be in clientsData yet
            Object.keys(messagesData).forEach((name) =>
                allClientNames.add(name)
            );

            // Convert set to array and sort by latest message time
            const sortedClientNames = Array.from(allClientNames).sort(
                (a, b) => {
                    const lastMsgA =
                        messagesData[a] && messagesData[a].length > 0
                            ? new Date(
                                  messagesData[a][
                                      messagesData[a].length - 1
                                  ].time
                              )
                            : new Date(0);
                    const lastMsgB =
                        messagesData[b] && messagesData[b].length > 0
                            ? new Date(
                                  messagesData[b][
                                      messagesData[b].length - 1
                                  ].time
                              )
                            : new Date(0);
                    return lastMsgB - lastMsgA; // Sort descending (latest on top)
                }
            );

            sortedClientNames.forEach((clientName) => {
                const latestMessage =
                    messagesData[clientName] &&
                    messagesData[clientName].length > 0
                        ? messagesData[clientName][
                              messagesData[clientName].length - 1
                          ]
                        : null;
                const preview = latestMessage
                    ? latestMessage.message
                    : 'No messages yet.';
                const time = latestMessage
                    ? new Date(latestMessage.time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                      })
                    : '';
                const profilePic = getClientProfilePic(clientName);

                const messageItemDiv = document.createElement('div');
                messageItemDiv.classList.add('message-item');
                if (clientName === currentOpenClientForMessages) {
                    messageItemDiv.classList.add('active');
                }
                messageItemDiv.dataset.clientName = clientName;
                messageItemDiv.innerHTML = `
                    <img src="${profilePic}" alt="Profile" class="profile-pic">
                    <div class="message-info">
                        <div class="message-sender">${clientName}</div>
                        <div class="message-preview">${preview}</div>
                    </div>
                    <div class="message-time">${time}</div>
                `;
                messageListDiv.appendChild(messageItemDiv);

                messageItemDiv.addEventListener('click', () =>
                    openChat(clientName)
                );
            });
        }

        function openChat(clientName) {
            currentOpenClientForMessages = clientName;
            chatClientNameSpan.textContent = clientName;
            chatClientProfilePic.src = getClientProfilePic(clientName);
            chatMessagesContainer.innerHTML = ''; // Clear previous chat
            messageInput.value = ''; // Clear input field

            const messages = messagesData[clientName] || [];
            messages.forEach((msg) => {
                const bubble = document.createElement('div');
                bubble.classList.add('message-bubble', msg.type);
                bubble.textContent = msg.message;
                chatMessagesContainer.appendChild(bubble);
            });
            chatMessagesContainer.scrollTop =
                chatMessagesContainer.scrollHeight; // Scroll to bottom

            // Update active state in message list
            messageListDiv.querySelectorAll('.message-item').forEach((item) => {
                item.classList.remove('active');
                if (item.dataset.clientName === clientName) {
                    item.classList.add('active');
                }
            });
        }

        sendMessageButton.addEventListener('click', () => {
            const messageText = messageInput.value.trim();
            if (messageText && currentOpenClientForMessages) {
                if (!messagesData[currentOpenClientForMessages]) {
                    messagesData[currentOpenClientForMessages] = [];
                }
                messagesData[currentOpenClientForMessages].push({
                    sender: 'You',
                    message: messageText,
                    time: new Date().toISOString(), // Use ISO string for consistent sorting
                    type: 'sent'
                });
                messageInput.value = ''; // Clear input
                saveMessagesData(); // Save to localStorage

                // Re-render the current chat and message list to show new message
                openChat(currentOpenClientForMessages);
                loadMessageList(); // Update the preview and sorting in the message list
            }
        });

        messageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessageButton.click();
            }
        });

        // Initialize message list and open chat if a client was selected
        loadMessageList();
        if (selectedClientName) {
            openChat(selectedClientName);
        } else if (Object.keys(messagesData).length > 0) {
            // If no specific client is selected, open the chat with the latest message
            const sortedClientNames = Array.from(
                Object.keys(messagesData)
            ).sort((a, b) => {
                const lastMsgA =
                    messagesData[a] && messagesData[a].length > 0
                        ? new Date(
                              messagesData[a][messagesData[a].length - 1].time
                          )
                        : new Date(0);
                const lastMsgB =
                    messagesData[b] && messagesData[b].length > 0
                        ? new Date(
                              messagesData[b][messagesData[b].length - 1].time
                          )
                        : new Date(0);
                return lastMsgB - lastMsgA; // Sort descending (latest on top)
            });
            const defaultClient = sortedClientNames[0];
            if (defaultClient) openChat(defaultClient);
        }
    }

    function renderMyDocuments(filterCaseId = null, filterClientName = null) {
        currentDocumentFilterCaseId = filterCaseId; // Store filter state
        currentDocumentFilterClientName = filterClientName; // Store filter state

        let documentsHtml = '<h2 class="section-header">My Documents</h2>';

        if (filterCaseId) {
            documentsHtml += `<p>Showing documents for Case ID: <strong>${filterCaseId}</strong> <button id="clear-document-filter" class="cancel-button">Clear Filter</button></p>`;
        } else if (filterClientName) {
            documentsHtml += `<p>Showing documents for Client: <strong>${filterClientName}</strong> <button id="clear-document-filter" class="cancel-button">Clear Filter</button></p>`;
        }
        documentsHtml += `
            <div class="documents-grid">
        `;

        const searchTerm = globalSearchInput.value.toLowerCase();

        const filteredDocuments = lawyerDocuments.filter((doc) => {
            const matchesCaseIdFilter = filterCaseId
                ? doc.caseId === filterCaseId
                : true;
            const matchesClientNameFilter = filterClientName
                ? doc.clientName === filterClientName
                : true;
            const matchesSearchTerm = searchTerm
                ? doc.name.toLowerCase().includes(searchTerm) ||
                  (doc.caseId &&
                      doc.caseId.toLowerCase().includes(searchTerm)) ||
                  (doc.clientName &&
                      doc.clientName.toLowerCase().includes(searchTerm))
                : true;

            return (
                matchesCaseIdFilter &&
                matchesClientNameFilter &&
                matchesSearchTerm
            );
        });

        if (filteredDocuments.length > 0) {
            filteredDocuments.forEach((doc) => {
                const iconClass =
                    doc.type === 'PDF'
                        ? 'fas fa-file-pdf'
                        : doc.type === 'JPEG'
                        ? 'fas fa-file-image'
                        : doc.type === 'XLSX'
                        ? 'fas fa-file-excel' // Added XLSX icon
                        : doc.type === 'DOCX'
                        ? 'fas fa-file-word'
                        : 'fas fa-file';
                documentsHtml += `
                    <div class="document-card">
                        <i class="${iconClass}"></i>
                        <h4>${doc.name}</h4>
                        <p>Client: ${doc.clientName}</p>
                        <p>Type: ${doc.type}</p>
                        <p>Uploaded: ${doc.uploadDate}</p>
                        <p>Case ID: ${doc.caseId || 'N/A'}</p>
                        <button class="view-document-button" data-document-id="${
                            doc.id
                        }">View Document</button>
                    </div>
                `;
            });
        } else {
            documentsHtml += `<p style="width: 100%; text-align: center;">No documents found for this criteria.</p>`;
        }

        documentsHtml += `
            </div>
        `;
        contentArea.innerHTML = documentsHtml;

        // Add event listeners for "View Document" buttons
        contentArea
            .querySelectorAll('.view-document-button')
            .forEach((button) => {
                button.addEventListener('click', (event) => {
                    const docId = event.target.dataset.documentId;
                    const documentDetails = lawyerDocuments.find(
                        (d) => d.id === docId
                    );
                    if (documentDetails) {
                        modalDocumentContent.innerHTML = `
                        <h3>${documentDetails.name}</h3>
                        <p><strong>Client:</strong> ${
                            documentDetails.clientName
                        }</p>
                        <p><strong>Type:</strong> ${documentDetails.type}</p>
                        <p><strong>Uploaded:</strong> ${
                            documentDetails.uploadDate
                        }</p>
                        <p><strong>Case ID:</strong> ${
                            documentDetails.caseId || 'N/A'
                        }</p>
                        <hr>
                        <p>${documentDetails.content}</p>
                    `;
                        documentViewModal.style.display = 'flex'; // Show modal
                    }
                });
            });

        // Add event listener for clear filter button
        const clearFilterButton = document.getElementById(
            'clear-document-filter'
        );
        if (clearFilterButton) {
            clearFilterButton.addEventListener('click', () =>
                renderMyDocuments(null, null)
            ); // Clear both filters
        }

        // Attach a custom event listener for global search
        contentArea.addEventListener('globalSearch', (event) => {
            renderMyDocuments(
                currentDocumentFilterCaseId,
                currentDocumentFilterClientName
            ); // Re-render with existing filters
        });
    }

    function renderProfile() {
        let profileHtml = `
            <h2 class="section-header">My Profile</h2>
            <div class="profile-details">
                <div class="profile-grid">
                    <div class="profile-field">
                        <label for="profile-full-name">Full Name</label>
                        <input type="text" id="profile-full-name" value="${lawyerData.fullName}">
                    </div>
                    <div class="profile-field">
                        <label for="profile-email">Email</label>
                        <input type="email" id="profile-email" value="${lawyerData.email}">
                    </div>
                    <div class="profile-field">
                        <label for="profile-password">Password</label>
                        <input type="password" id="profile-password" value="${lawyerData.password}" placeholder="********">
                    </div>
                    <div class="profile-field">
                        <label for="profile-phone">Phone</label>
                        <input type="tel" id="profile-phone" value="${lawyerData.phone}">
                    </div>
                    <div class="profile-field">
                        <label for="profile-specialization">Specialization</label>
                        <input type="text" id="profile-specialization" value="${lawyerData.specialization}">
                    </div>
                    <div class="profile-field">
                        <label for="profile-experience">Years of Experience</label>
                        <input type="number" id="profile-experience" value="${lawyerData.yearsOfExperience}" min="0">
                    </div>
                    <div class="profile-field">
                        <label for="profile-location">Location</label>
                        <input type="text" id="profile-location" value="${lawyerData.location}">
                    </div>
                    <div class="profile-field full-width">
                        <label for="profile-bio">Bio</label>
                        <textarea id="profile-bio">${lawyerData.bio}</textarea>
                    </div>
                </div>
                <div class="profile-buttons">
                    <button id="cancel-profile-changes" class="cancel-button">Cancel</button>
                    <button id="save-profile-changes" class="save-button">Save Changes</button>
                </div>
            </div>
        `;
        contentArea.innerHTML = profileHtml;

        // Add event listeners for profile buttons
        const saveButton = document.getElementById('save-profile-changes');
        const cancelButton = document.getElementById('cancel-profile-changes');

        saveButton.addEventListener('click', () => {
            lawyerData.fullName =
                document.getElementById('profile-full-name').value;
            lawyerData.email = document.getElementById('profile-email').value;
            lawyerData.password =
                document.getElementById('profile-password').value; // Update password
            lawyerData.phone = document.getElementById('profile-phone').value;
            lawyerData.specialization = document.getElementById(
                'profile-specialization'
            ).value;
            lawyerData.yearsOfExperience = parseInt(
                document.getElementById('profile-experience').value
            );
            lawyerData.location =
                document.getElementById('profile-location').value;
            lawyerData.bio = document.getElementById('profile-bio').value;

            saveLawyerData(); // Save to localStorage
            updateSidebarUserInfo(); // Update sidebar immediately
            alert('Profile details saved successfully!'); // Use custom modal in production
            renderSection('profile'); // Re-render to show updated static text (or keep fields editable)
        });

        cancelButton.addEventListener('click', () => {
            renderSection('profile'); // Simply re-render to discard changes
        });
    }

    // --- Modal Specific Logic ---

    // Accept/Decline Request buttons in modal
    acceptRequestButton.addEventListener('click', () => {
        const requestId = requestDetailModal.dataset.currentRequestId;
        const requestIndex = caseRequests.findIndex(
            (req) => req.id === requestId
        );

        if (requestIndex > -1) {
            const acceptedRequest = caseRequests.splice(requestIndex, 1)[0]; // Remove from requests

            // Add to lawyerCases (use existing caseId if provided by client, otherwise generate new)
            const newCaseId =
                acceptedRequest.caseId ||
                'C-' + (lawyerCases.length + 1000).toString(); // Use client's caseId if available
            lawyerCases.push({
                id: newCaseId,
                clientName: acceptedRequest.clientName,
                type: acceptedRequest.type,
                status: 'Active',
                lastUpdate: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                details: acceptedRequest.description,
                documents: acceptedRequest.documents // Carry over documents
            });

            // Add client to clientsData if not already present, and associate case
            let client = clientsData.find(
                (c) => c.name === acceptedRequest.clientName
            );
            if (!client) {
                client = {
                    id: 'CL-' + (clientsData.length + 1).toString(),
                    name: acceptedRequest.clientName,
                    email: `${acceptedRequest.clientName
                        .toLowerCase()
                        .replace(' ', '.')}.example.com`, // Dummy email
                    phone: 'N/A', // Dummy phone
                    profilePic: getClientProfilePic(acceptedRequest.clientName),
                    associatedCases: []
                };
                clientsData.push(client);
            }
            if (!client.associatedCases.includes(newCaseId)) {
                client.associatedCases.push(newCaseId);
            }

            // If documents came with the request, ensure they are in lawyerDocuments
            if (
                acceptedRequest.documents &&
                acceptedRequest.documents.length > 0
            ) {
                acceptedRequest.documents.forEach((doc) => {
                    // Check if document already exists to avoid duplicates
                    if (
                        !lawyerDocuments.some(
                            (ld) =>
                                ld.name === doc.name && ld.caseId === newCaseId
                        )
                    ) {
                        lawyerDocuments.push({
                            id:
                                'LDOC-' +
                                (lawyerDocuments.length + 1)
                                    .toString()
                                    .padStart(3, '0'),
                            name: doc.name,
                            clientName: acceptedRequest.clientName,
                            type: doc.name.split('.').pop().toUpperCase(), // Infer type
                            uploadDate: new Date().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            }),
                            caseId: newCaseId,
                            content: doc.content
                        });
                    }
                });
            }

            saveCaseRequests(); // Saves pendingLawyerRequests
            saveLawyerCases();
            saveClientsData();
            saveLawyerDocuments(); // Save updated documents
            alert(
                `Case ${newCaseId} accepted for ${acceptedRequest.clientName}!`
            );
            requestDetailModal.style.display = 'none';
            renderSection('cases'); // Re-render cases section to update lists
        }
    });

    declineRequestButton.addEventListener('click', () => {
        const requestId = requestDetailModal.dataset.currentRequestId;
        const requestIndex = caseRequests.findIndex(
            (req) => req.id === requestId
        );

        if (requestIndex > -1) {
            const declinedRequest = caseRequests.splice(requestIndex, 1)[0]; // Remove from requests
            saveCaseRequests();
            alert(`Case request from ${declinedRequest.clientName} declined.`);
            requestDetailModal.style.display = 'none';
            renderSection('cases'); // Re-render cases section to update lists
        }
    });

    // Add Task Modal Logic
    saveTaskButton.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText && tasksData.length < 5) {
            // Limit to 5 tasks
            const newTaskId = 'TASK-' + (tasksData.length + 1).toString();
            tasksData.push({
                id: newTaskId,
                text: taskText,
                completed: false,
                dueDate: 'Today' // Default for simplicity
            });
            saveTasksData();
            newTaskInput.value = '';
            addTaskModal.style.display = 'none';
            renderSection('dashboard'); // Re-render dashboard to show new task
        } else if (tasksData.length >= 5) {
            alert(
                'You can only have up to 5 priority tasks. Please complete existing tasks or remove them.'
            ); // Use custom modal
        } else {
            alert('Task description cannot be empty.'); // Use custom modal
        }
    });

    // Edit Task Modal Logic
    updateTaskButton.addEventListener('click', () => {
        const taskId = editTaskId.value;
        const newText = editTaskInput.value.trim();
        const taskIndex = tasksData.findIndex((t) => t.id === taskId);

        if (taskIndex > -1 && newText) {
            tasksData[taskIndex].text = newText;
            saveTasksData();
            editTaskModal.style.display = 'none';
            renderSection('dashboard'); // Re-render dashboard
        } else {
            alert('Task description cannot be empty.');
        }
    });

    removeTaskButton.addEventListener('click', () => {
        const taskId = editTaskId.value;
        if (confirm('Are you sure you want to remove this task?')) {
            // Use custom modal
            tasksData = tasksData.filter((t) => t.id !== taskId);
            saveTasksData();
            editTaskModal.style.display = 'none';
            renderSection('dashboard'); // Re-render dashboard
        }
    });

    // Edit Schedule Modal Logic
    saveScheduleButton.addEventListener('click', () => {
        const id = editScheduleId.value;
        const time = editScheduleTime.value.trim();
        const title = editScheduleTitle.value.trim();
        const description = editScheduleDescription.value.trim();
        const date = editScheduleDate.value; // Get date from input

        if (!time || !title || !date) {
            alert('Time, Title, and Date are required for a schedule entry.');
            return;
        }

        if (id) {
            // Editing existing entry
            const index = scheduleData.findIndex((s) => s.id === id);
            if (index > -1) {
                scheduleData[index] = {
                    ...scheduleData[index],
                    time,
                    title,
                    description,
                    date
                };
            }
        } else {
            // Adding new entry
            const newId = 'SCH-' + (scheduleData.length + 1).toString();
            scheduleData.push({ id: newId, time, title, description, date });
        }
        saveScheduleData();
        editScheduleModal.style.display = 'none';
        renderSection('calendar'); // Re-render calendar
    });

    deleteScheduleButton.addEventListener('click', () => {
        const id = editScheduleId.value;
        if (confirm('Are you sure you want to delete this schedule entry?')) {
            // Use custom modal
            scheduleData = scheduleData.filter((s) => s.id !== id);
            saveScheduleData();
            editScheduleModal.style.display = 'none';
            renderSection('calendar'); // Re-render calendar
        }
    });

    // --- Global Search Functionality ---
    globalSearchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const currentActiveSection = document.querySelector(
            '.navigation ul li.active'
        ).dataset.section;

        // Dispatch a custom event to the current section to handle filtering
        const globalSearchEvent = new CustomEvent('globalSearch', {
            detail: { searchTerm: searchTerm }
        });
        contentArea.dispatchEvent(globalSearchEvent);

        // Special handling for dashboard (no direct filtering, but input is live)
        if (currentActiveSection === 'dashboard') {
            // No direct filtering needed for dashboard summary/recents, but input is active.
            // Could add logic here to highlight search results if needed.
        }
    });

    // --- General Event Listeners ---

    // Sidebar navigation clicks
    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const section = link.dataset.section;
            renderSection(section);
        });
    });

    // Logout button click
    logoutButton.addEventListener('click', () => {
        // In a real application, this would clear session/auth tokens and redirect to login page
        alert('You have been logged out.'); // Using alert for simple demo, replace with custom modal
        // Clear all local storage for a clean logout demo
        localStorage.clear();
        window.location.href = '../index.html'; // Redirect to index.html
    });

    // Close modal buttons
    closeButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.target.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside of modal content
    window.addEventListener('click', (event) => {
        if (event.target === caseDetailModal) {
            caseDetailModal.style.display = 'none';
        }
        if (event.target === requestDetailModal) {
            requestDetailModal.style.display = 'none';
        }
        if (event.target === documentViewModal) {
            documentViewModal.style.display = 'none';
        }
        if (event.target === documentSummaryModal) {
            documentSummaryModal.style.display = 'none';
        }
        if (event.target === addTaskModal) {
            addTaskModal.style.display = 'none';
        }
        if (event.target === editTaskModal) {
            editTaskModal.style.display = 'none';
        }
        if (event.target === editScheduleModal) {
            editScheduleModal.style.display = 'none';
        }
    });

    // Initial load: render Dashboard section and update sidebar user info
    updateSidebarUserInfo();
    renderSection('dashboard');
});
