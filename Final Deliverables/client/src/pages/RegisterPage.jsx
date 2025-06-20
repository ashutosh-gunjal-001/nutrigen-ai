import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoEyeOutline, 
  IoEyeOffOutline,
  IoCheckmarkCircleOutline,
  IoBodyOutline,
  IoLeafOutline,
  IoFitnessOutline,
  IoWalkOutline
} from 'react-icons/io5';
import { register, clearError } from '../app/features/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { validateEmail, validatePassword } from '../utils/validators';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    dietPreference: '',
    goal: '',
    activityLevel: '',
    allergies: [],
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailError, setEmailError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const dietOptions = [
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'Vegan', label: 'Vegan' },
    { value: 'Non-Vegetarian', label: 'Non-Vegetarian' },
    { value: 'Keto', label: 'Keto' },
  ];

  const goalOptions = [
    { value: 'Weight Loss', label: 'Weight Loss' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Muscle Gain', label: 'Muscle Gain' },
  ];

  const activityLevels = [
    { value: 'Sedentary', label: 'Sedentary (little to no exercise)' },
    { value: 'Lightly Active', label: 'Lightly Active (1–3 days/week)' },
    { value: 'Moderately Active', label: 'Moderately Active (3–5 days/week)' },
    { value: 'Very Active', label: 'Very Active (6–7 days/week)' },
    { value: 'Super Active', label: 'Super Active (intense training)' },
  ];

  const allergyOptions = ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'None'];

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const passwordChecks = validatePassword(formData.password).checks;

  useEffect(() => {
    const { checks } = validatePassword(formData.password);
    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmailError(validateEmail(value) ? '' : 'Invalid email address');
    }
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAllergyChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const newAllergies = checked
        ? [...prevData.allergies, value]
        : prevData.allergies.filter((allergy) => allergy !== value);
      return { ...prevData, allergies: newAllergies };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setEmailError('Invalid email address');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    const { confirmPassword, allergies, ...rest } = formData;
    const registrationData = {
      ...rest,
      allergies: allergies.length > 0 ? allergies.join(',') : 'None',
    };
    dispatch(register(registrationData));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const Select = ({ label, name, value, onChange, options, required, placeholder, icon: Icon }) => (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition-colors duration-200 ${Icon ? 'pl-10' : 'pl-4'} pr-4 appearance-none dark:bg-gray-800 dark:text-gray-300`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full mx-auto"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
            <IoPersonOutline className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Account</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Join NutriGen and start your nutrition journey</p>
        </div>

        <Card 
          className="w-full p-8"
          shadow="shadow-xl"
          hover={false}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900 dark:border-red-800 dark:text-red-300"
              >
                {error}
              </motion.div>
            )}

            <div className="p-4 border rounded-lg space-y-4 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 border-b pb-2">Health Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" name="name" type="text" value={formData.name} onChange={handleChange} required icon={IoPersonOutline} placeholder="Enter your full name" />
                <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required placeholder="Enter your age" />
                <Input label="Height (cm)" name="height" type="number" value={formData.height} onChange={handleChange} required placeholder="Enter your height" />
                <Input label="Weight (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} required placeholder="Enter your weight" />
                <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={genderOptions} required placeholder="Select gender" icon={IoBodyOutline} />
                <Select label="Diet Preference" name="dietPreference" value={formData.dietPreference} onChange={handleChange} options={dietOptions} required placeholder="Select diet" icon={IoLeafOutline} />
                <Select label="Goal" name="goal" value={formData.goal} onChange={handleChange} options={goalOptions} required placeholder="Select goal" icon={IoFitnessOutline} />
                <Select label="Activity Level" name="activityLevel" value={formData.activityLevel} onChange={handleChange} options={activityLevels} required placeholder="Select activity level" icon={IoWalkOutline} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Allergies</label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allergyOptions.map(allergy => (
                    <label key={allergy} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input type="checkbox" value={allergy} checked={formData.allergies.includes(allergy)} onChange={handleAllergyChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{allergy}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-4 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 border-b pb-2">Account Creation</h3>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                icon={IoMailOutline}
                placeholder="Enter your email"
                error={emailError}
              />
              <div className="space-y-2">
                <div className="relative">
                  <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required icon={IoLockClosedOutline} placeholder="Create a strong password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 dark:text-gray-500 hover:text-gray-600"><IoEyeOutline size={20} /></button>
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`} style={{ width: `${(passwordStrength / 5) * 100}%` }} /></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{getPasswordStrengthText()}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div className={`flex items-center space-x-2 ${passwordChecks.minLength ? 'text-green-600' : ''}`}><IoCheckmarkCircleOutline className={`h-3 w-3 ${passwordChecks.minLength ? 'text-green-600' : 'text-gray-300 dark:text-gray-500'}`} /><span>At least 8 characters</span></div>
                      <div className={`flex items-center space-x-2 ${passwordChecks.hasUpperCase ? 'text-green-600' : ''}`}><IoCheckmarkCircleOutline className={`h-3 w-3 ${passwordChecks.hasUpperCase ? 'text-green-600' : 'text-gray-300 dark:text-gray-500'}`} /><span>One uppercase letter</span></div>
                      <div className={`flex items-center space-x-2 ${passwordChecks.hasNumbers ? 'text-green-600' : ''}`}><IoCheckmarkCircleOutline className={`h-3 w-3 ${passwordChecks.hasNumbers ? 'text-green-600' : 'text-gray-300 dark:text-gray-500'}`} /><span>One number</span></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <Input label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required icon={IoLockClosedOutline} placeholder="Confirm your password" error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-400 dark:text-gray-500 hover:text-gray-600"><IoEyeOffOutline size={20} /></button>
              </div>
            </div>

            <div className="flex items-start">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded mt-1" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">I agree to the <Link to="/terms" className="text-primary dark:text-primary-dark hover:text-primary-dark">Terms of Service</Link> and <Link to="/privacy" className="text-primary dark:text-primary-dark hover:text-primary-dark">Privacy Policy</Link></label>
            </div>

            <Button type="submit" loading={isLoading} className="w-full" size="lg" disabled={formData.password !== formData.confirmPassword}>Create Account</Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">Already have an account? <Link to="/login" className="text-primary dark:text-primary-dark hover:text-primary-dark font-medium">Sign in here</Link></p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-500">← Back to Homepage</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;