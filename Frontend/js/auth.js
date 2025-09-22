// Authentication functionality

document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on an auth page
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');

    // Helper to show error messages
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
        }
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Basic validation
            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }

            // Determine if lawyer or client login
            // This correctly checks the current URL for '/Lawyer/' to determine role
            const isLawyer = window.location.href.includes('/auth/Lawyer/');
            const role = isLawyer ? 'lawyer' : 'client';

            // Simulate loading state
            const loginButton = document.getElementById('login-button');
            if (loginButton) {
                loginButton.textContent = 'Signing in...';
                loginButton.disabled = true;
            }

            // Simulate API call with timeout
            setTimeout(() => {
                // For demo purposes, any login works with valid format
                if (email.includes('@') && password.length >= 6) {
                    // Create user object
                    const user = {
                        id: Math.random().toString(36).substring(2, 9),
                        name: email
                            .split('@')[0]
                            .replace(/[^a-zA-Z0-9]/g, ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase()),
                        email: email,
                        role: role,
                        profileImage: isLawyer
                            ? 'https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg'
                            : 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
                    };

                    // Store in localStorage (in a real app, you'd use a token)
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    // Redirect to appropriate dashboard
                    // *** REDIRECTION PATHS ARE CORRECT AS PROVIDED ***
                    window.location.href = isLawyer
                        ? '../../dashboard/lawyer.html' // Go up from auth/Lawyer to project/, then into dashboard/
                        : '../../dashboard/user.html'; // Go up from auth/User to project/, then into dashboard/
                } else {
                    showError('Invalid email or password');
                    if (loginButton) {
                        loginButton.textContent = 'Sign In';
                        loginButton.disabled = false;
                    }
                }
            }, 1000);
        });
    }

    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword =
                document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms');

            // Basic validation
            if (!name || !email || !password) {
                showError('Please fill in all required fields');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            if (terms && !terms.checked) {
                showError('Please accept the terms and conditions');
                return;
            }

            // Determine if lawyer or client signup
            const isLawyer = window.location.href.includes('/auth/Lawyer/');
            const role = isLawyer ? 'lawyer' : 'client';

            // Collect additional lawyer-specific data if on lawyer signup
            let userData = {
                name,
                email,
                role
            };

            if (isLawyer) {
                const phone = document.getElementById('phone').value;
                const specialization =
                    document.getElementById('specialization').value;
                const experience = document.getElementById('experience').value;
                const location = document.getElementById('location').value;
                const bio = document.getElementById('bio').value;

                if (
                    !phone ||
                    !specialization ||
                    !experience ||
                    !location ||
                    !bio
                ) {
                    showError(
                        'Please complete all fields in your professional profile'
                    );
                    return;
                }

                userData = {
                    ...userData,
                    phone,
                    specialization,
                    experience,
                    location,
                    bio
                };
            }

            // Simulate loading state
            const signupButton = document.getElementById('signup-button');
            if (signupButton) {
                signupButton.textContent = 'Creating Account...';
                signupButton.disabled = true;
            }

            // Simulate API call with timeout
            setTimeout(() => {
                // For demo purposes, any signup works with valid format
                if (email.includes('@') && password.length >= 6) {
                    // Add id and profile image to user data
                    userData.id = Math.random().toString(36).substring(2, 9);
                    userData.profileImage = isLawyer
                        ? 'https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg'
                        : 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg';

                    // Store in localStorage (in a real app, you'd use a token)
                    localStorage.setItem(
                        'currentUser',
                        JSON.stringify(userData)
                    );

                    // Redirect to appropriate dashboard
                    // *** REDIRECTION PATHS ARE CORRECT AS PROVIDED ***
                    window.location.href = isLawyer
                        ? '../../dashboard/lawyer.html' // Go up from auth/Lawyer to project/, then into dashboard/
                        : '../../dashboard/user.html'; // Go up from auth/User to project/, then into dashboard/
                } else {
                    showError(
                        'Please use a valid email address and a password with at least 6 characters'
                    );
                    if (signupButton) {
                        signupButton.textContent = 'Create Account';
                        signupButton.disabled = false;
                    }
                }
            }, 1500);
        });
    }
});
