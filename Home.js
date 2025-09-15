
    // BMI Calculator
    const calculateBmiBtn = document.getElementById('calculate-bmi');
    if (calculateBmiBtn) {
        calculateBmiBtn.addEventListener('click', calculateBMI);
    }
// BMI Calculator
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const bmiMessage = document.getElementById('bmi-message');

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        bmiValue.textContent = '-';
        bmiCategory.textContent = '-';
        bmiMessage.textContent = 'Please enter valid height and weight values.';
        return;
    }

    // Calculate BMI: weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBMI = Math.round(bmi * 10) / 10;
    
    bmiValue.textContent = roundedBMI;

    // Determine BMI category
    let category, message;
    if (bmi < 18.5) {
        category = 'Underweight';
        bmiCategory.style.color = '#3498db'; // blue
        message = 'You are below the recommended weight for your height. Consider consulting with a nutritionist.';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal Weight';
        bmiCategory.style.color = '#2ecc71'; // green
        message = 'You are at a healthy weight for your height. Keep up the good work!';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        bmiCategory.style.color = '#f39c12'; // orange
        message = 'You are above the recommended weight for your height. Consider regular exercise and a balanced diet.';
    } else {
        category = 'Obese';
        bmiCategory.style.color = '#e74c3c'; // red
        message = 'You are well above the recommended weight for your height. Consider consulting with a healthcare professional.';
    }

    bmiCategory.textContent = category;
    bmiMessage.textContent = message;
}
