// Find Lawyer functionality

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the find lawyer page
  const lawyersGrid = document.getElementById('lawyers-list');
  if (!lawyersGrid) return;
  
  // Define state variables
  let currentPage = 1;
  const perPage = 6;
  let allLawyers = [];
  let filteredLawyers = [];
  
  // Track filter state
  const filterState = {
    practiceAreas: [],
    experience: 'any',
    location: ''
  };
  
  // Elements
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const sortBy = document.getElementById('sort-by');
  const locationFilter = document.getElementById('location-filter');
  const applyFiltersButton = document.getElementById('apply-filters');
  const resetFiltersButton = document.getElementById('reset-filters');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const pageIndicator = document.getElementById('page-indicator');
  
  // Practice area checkboxes
  const practiceCheckboxes = document.querySelectorAll('input[name="practice"]');
  
  // Experience radio buttons
  const experienceRadios = document.querySelectorAll('input[name="experience"]');
  
  // Fetch lawyers data
  function fetchLawyers() {
    // For demo purposes, we'll create dummy data
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate 20 lawyers with different specializations
        const specializations = [
          'Family Law', 'Criminal Defense', 'Corporate Law', 'Immigration',
          'Real Estate', 'Tax Law', 'Employment Law', 'Intellectual Property'
        ];
        
        const locations = [
          'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Miami, FL'
        ];
        
        const avatars = [
          'https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg',
          'https://images.pexels.com/photos/7516339/pexels-photo-7516339.jpeg',
          'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
          'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
          'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg',
          'https://images.pexels.com/photos/5588224/pexels-photo-5588224.jpeg'
        ];
        
        const lawyers = [];
        
        for (let i = 1; i <= 20; i++) {
          const randomExp = Math.floor(Math.random() * 25) + 1;
          const randomSpec = specializations[Math.floor(Math.random() * specializations.length)];
          const randomLoc = locations[Math.floor(Math.random() * locations.length)];
          const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
          const randomRating = (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
          
          lawyers.push({
            id: i,
            name: `Lawyer ${i}`,
            specialization: randomSpec,
            experience: randomExp,
            location: randomLoc,
            rating: randomRating,
            avatar: randomAvatar,
            bio: `Experienced ${randomSpec} attorney with ${randomExp} years of practice. Specializing in complex ${randomSpec.toLowerCase()} cases with a high success rate.`,
            hourlyRate: Math.floor(Math.random() * 300) + 150,
            consultationFee: Math.floor(Math.random() * 200) + 50,
            cases: Math.floor(Math.random() * 300) + 50
          });
        }
        
        resolve(lawyers);
      }, 800);
    });
  }
  
  // Render lawyers grid
  function renderLawyers() {
    // Calculate pagination
    const totalPages = Math.ceil(filteredLawyers.length / perPage);
    const startIdx = (currentPage - 1) * perPage;
    const endIdx = Math.min(startIdx + perPage, filteredLawyers.length);
    const currentLawyers = filteredLawyers.slice(startIdx, endIdx);
    
    // Update pagination controls
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages || totalPages === 0;
    pageIndicator.textContent = totalPages === 0 
      ? 'No results' 
      : `Page ${currentPage} of ${totalPages}`;
    
    // Clear existing content
    lawyersGrid.innerHTML = '';
    
    // If no results
    if (currentLawyers.length === 0) {
      lawyersGrid.innerHTML = '<div class="empty-state">No lawyers found matching your criteria. Try adjusting your filters.</div>';
      return;
    }
    
    // Render lawyer cards
    currentLawyers.forEach(lawyer => {
      const lawyerCard = document.createElement('div');
      lawyerCard.classList.add('lawyer-card');
      
      // Generate stars for rating
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(lawyer.rating)) {
          stars += '★'; // Full star
        } else if (i - 0.5 <= lawyer.rating) {
          stars += '⯨'; // Half star (approximation)
        } else {
          stars += '☆'; // Empty star
        }
      }
      
      lawyerCard.innerHTML = `
        <div class="lawyer-header">
          <div class="lawyer-avatar">
            <img src="${lawyer.avatar}" alt="${lawyer.name}">
          </div>
          <div class="lawyer-info">
            <h3>${lawyer.name}</h3>
            <p>${lawyer.specialization}</p>
            <div class="lawyer-rating">
              <span class="star-icon">${stars}</span>
              <span>${lawyer.rating}/5</span>
            </div>
          </div>
        </div>
        <div class="lawyer-body">
          <p>${lawyer.bio}</p>
          <div class="lawyer-details">
            <div class="detail-item">
              <span class="detail-label">Experience</span>
              <span class="detail-value">${lawyer.experience} years</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Location</span>
              <span class="detail-value">${lawyer.location}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Hourly Rate</span>
              <span class="detail-value">$${lawyer.hourlyRate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Consultation</span>
              <span class="detail-value">$${lawyer.consultationFee}</span>
            </div>
          </div>
          <div class="lawyer-actions">
            <button class="btn btn-outline">Contact</button>
            <button class="btn btn-primary">Book Consultation</button>
          </div>
        </div>
      `;
      
      lawyersGrid.appendChild(lawyerCard);
    });
  }
  
  // Apply filters to lawyers
  function applyFilters() {
    let results = [...allLawyers];
    
    // Filter by search term if provided
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
      results = results.filter(lawyer => 
        lawyer.name.toLowerCase().includes(searchTerm) ||
        lawyer.specialization.toLowerCase().includes(searchTerm) ||
        lawyer.location.toLowerCase().includes(searchTerm) ||
        lawyer.bio.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by practice areas
    if (filterState.practiceAreas.length > 0) {
      results = results.filter(lawyer => 
        filterState.practiceAreas.some(area => 
          lawyer.specialization.toLowerCase().includes(area.toLowerCase())
        )
      );
    }
    
    // Filter by experience
    if (filterState.experience !== 'any') {
      if (filterState.experience === '1-5') {
        results = results.filter(lawyer => lawyer.experience >= 1 && lawyer.experience <= 5);
      } else if (filterState.experience === '5-10') {
        results = results.filter(lawyer => lawyer.experience > 5 && lawyer.experience <= 10);
      } else if (filterState.experience === '10+') {
        results = results.filter(lawyer => lawyer.experience > 10);
      }
    }
    
    // Filter by location
    if (filterState.location) {
      results = results.filter(lawyer => 
        lawyer.location.toLowerCase().includes(filterState.location.toLowerCase())
      );
    }
    
    // Sort results
    const sortValue = sortBy.value;
    if (sortValue === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortValue === 'experience') {
      results.sort((a, b) => b.experience - a.experience);
    }
    
    // Update state and render
    filteredLawyers = results;
    currentPage = 1;
    renderLawyers();
  }
  
  // Initialize
  async function init() {
    // Show loading state
    lawyersGrid.innerHTML = '<div class="empty-state">Loading lawyers...</div>';
    
    // Fetch lawyers
    allLawyers = await fetchLawyers();
    filteredLawyers = [...allLawyers];
    
    // Initial render
    renderLawyers();
    
    // Set up event listeners
    
    // Search
    searchButton.addEventListener('click', () => {
      applyFilters();
    });
    
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        applyFilters();
      }
    });
    
    // Sort
    sortBy.addEventListener('change', () => {
      applyFilters();
    });
    
    // Practice area checkboxes
    practiceCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        filterState.practiceAreas = Array.from(practiceCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);
      });
    });
    
    // Experience radio buttons
    experienceRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        filterState.experience = radio.value;
      });
    });
    
    // Location filter
    locationFilter.addEventListener('change', () => {
      filterState.location = locationFilter.value;
    });
    
    // Apply filters button
    applyFiltersButton.addEventListener('click', () => {
      applyFilters();
    });
    
    // Reset filters button
    resetFiltersButton.addEventListener('click', () => {
      // Reset form elements
      searchInput.value = '';
      sortBy.value = 'relevance';
      practiceCheckboxes.forEach(cb => cb.checked = false);
      experienceRadios[0].checked = true; // "Any" option
      locationFilter.value = '';
      
      // Reset filter state
      filterState.practiceAreas = [];
      filterState.experience = 'any';
      filterState.location = '';
      
      // Reset and render
      filteredLawyers = [...allLawyers];
      currentPage = 1;
      renderLawyers();
    });
    
    // Pagination
    prevPageButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderLawyers();
        window.scrollTo(0, 0);
      }
    });
    
    nextPageButton.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredLawyers.length / perPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderLawyers();
        window.scrollTo(0, 0);
      }
    });
  }
  
  // Start initialization
  init();
});
