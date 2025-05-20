const form = document.getElementById('candidateForm');
const saveBtn = document.getElementById('saveBtn');
const showPhone = document.getElementById('showPhone');
const phoneField = document.getElementById('phoneField');
const successMsg = document.getElementById('successMsg');

// ...existing code...
document.addEventListener('DOMContentLoaded', function() {
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  let visible = false;

  togglePassword.addEventListener('click', function() {
    visible = !visible;
    passwordInput.type = visible ? 'text' : 'password';
    togglePassword.textContent = visible ? '🙈' : '👁️';
  });
});
function validateName(name) {
  if (!name) return "Name is required.";
  const trimmed = name.trim();
  if (!/^[A-Za-z]+ [A-Za-z]+$/.test(trimmed)) {
    return "Name must contain exactly two words, each with only letters.";
  }
  return "";
}
function validateEmail(email) {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
  return "";
}
function validatePhone(phone, show) {
  if (!show) return "";
  if (!phone) return "";
  if (!/^\d{10}$/.test(phone)) return "Phone must be exactly 10 digits.";
  return "";
}
function validatePassword(pw) {
  if (!pw) return "Password is required.";
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/\d/.test(pw) || !/[!@#$%^&*(),.?":{}|<>]/.test(pw))
    return "Password must include uppercase, lowercase, digit, special character and be 8+ chars.";
  return "";
}
function validateLang(lang) {
  if (!lang) return "Please select a language.";
  return "";
}
function validateAbout(about) {
  if (!about) return "About is required.";
  if (about.length < 50 || about.length > 500) return "About must be between 50 to 500 characters.";
  return "";
}

// Show/hide phone field
function togglePhoneField() {
  phoneField.style.display = showPhone.checked ? 'block' : 'none';
}
togglePhoneField();
showPhone.addEventListener('change', () => {
  togglePhoneField();
  validateForm();
});

// Validate all fields and update errors
function validateForm() {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const password = form.password.value;
  const lang = form.lang.value;
  const about = form.about.value.trim();
  const phoneToggle = showPhone.checked;

  document.getElementById('nameError').textContent = validateName(name);
  document.getElementById('emailError').textContent = validateEmail(email);
  document.getElementById('phoneError').textContent = validatePhone(phone, phoneToggle);
  document.getElementById('passwordError').textContent = validatePassword(password);
  document.getElementById('langError').textContent = validateLang(lang);
  document.getElementById('aboutError').textContent = validateAbout(about);

  // Enable Save only if all validations pass
  const isValid =
    !validateName(name) &&
    !validateEmail(email) &&
    !validatePhone(phone, phoneToggle) &&
    !validatePassword(password) &&
    !validateLang(lang) &&
    !validateAbout(about);

  saveBtn.disabled = !isValid;
  successMsg.textContent = "";
}

// Attach validation on input/change
['name','email','phone','password','lang','about'].forEach(id => {
  form[id].addEventListener('input', validateForm);
});
showPhone.addEventListener('change', validateForm);

// On submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  validateForm();
  if (saveBtn.disabled) return;

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: showPhone.checked ? form.phone.value.trim() : "",
    password: form.password.value,
    lang: form.lang.value,
    about: form.about.value.trim()
  };
  console.log(formData);

  try {
    const res = await fetch('https://admin-staging.whydonate.dev/whydonate/assignment', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });
    if (res.status === 200) {
      successMsg.textContent = "Save successful!";
      form.reset();
      togglePhoneField();
      saveBtn.disabled = true;
    } else {
      successMsg.textContent = "Submission failed. Please try again.";
      successMsg.style.color = "#d32f2f";
    }
  } catch {
    successMsg.textContent = "Network error. Please try again.";
    successMsg.style.color = "#d32f2f";
  }
});