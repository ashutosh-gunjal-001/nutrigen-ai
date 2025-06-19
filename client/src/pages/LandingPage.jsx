import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IoNutritionOutline, 
  IoCalendarOutline, 
  IoSearchOutline, 
  IoChatbubbleOutline,
  IoCheckmarkCircleOutline,
  IoArrowForwardOutline,
  IoStatsChartOutline,
  IoShieldCheckmarkOutline,
  IoFlashOutline
} from 'react-icons/io5';
import Button from '../components/ui/Button';

const LandingPage = () => {
  const features = [
    {
      icon: IoCalendarOutline,
      title: 'Tailored Meal Planning',
      description: 'Generate personalized weekly meal plans with recipes and grocery lists based on your dietary needs, preferences, and health goals.',
      color: 'from-primary to-primary-light'
    },
    {
      icon: IoSearchOutline,
      title: 'Dynamic Nutritional Insights',
      description: 'Get instant, detailed nutritional breakdowns for any food item. Scan barcodes or search our comprehensive database.',
      color: 'from-secondary to-secondary-light'
    },
    {
      icon: IoChatbubbleOutline,
      title: 'Virtual Nutrition Coaching',
      description: 'Access AI-powered nutrition expertise 24/7. Get personalized advice, answer questions, and stay motivated.',
      color: 'from-primary-light to-secondary'
    }
  ];

  const benefits = [
    { icon: IoCheckmarkCircleOutline, text: 'Personalized recommendations based on your unique profile' },
    { icon: IoCheckmarkCircleOutline, text: 'Real-time nutritional analysis and tracking' },
    { icon: IoCheckmarkCircleOutline, text: 'Evidence-based advice from advanced AI' },
    { icon: IoCheckmarkCircleOutline, text: 'Seamless integration with your lifestyle' }
  ];

  const stats = [
    { icon: IoStatsChartOutline, number: '10,000+', label: 'Foods Analyzed' },
    { icon: IoShieldCheckmarkOutline, number: '99.9%', label: 'Accuracy Rate' },
    { icon: IoFlashOutline, number: '<1s', label: 'Response Time' },
    { icon: IoNutritionOutline, number: '24/7', label: 'AI Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-[0.02]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Advancing Nutrition
                </span>
                <br />
                <span className="text-gray-900 dark:text-gray-100">Science Through AI</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Empower your health journey with AI-powered nutritional insights, personalized meal planning, and virtual coaching.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button as={Link} to="/register" size="lg" className="text-lg px-8 py-4">
                Get Started Free
                <IoArrowForwardOutline className="ml-2" />
              </Button>
              <Button as={Link} to="/login" variant="outline" size="lg" className="text-lg px-8 py-4">
                Sign In
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-3 shadow-lg flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary dark:text-primary-300" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Three Powerful <span className="text-primary">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive nutrition tools designed to transform how you understand and manage your dietary choices.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="h-full"
                >
                  <div className="h-full bg-white dark:bg-gray-800 rounded-2xl p-8 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-transparent">
                    <div className={`bg-gradient-to-r ${feature.color} rounded-full p-4 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Why Choose <span className="text-primary">NutriGen?</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Our AI-powered platform combines cutting-edge technology with nutritional science to deliver personalized insights that actually work.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3"
                    >
                      <Icon className="h-6 w-6 text-primary dark:text-primary-300 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white mb-6">
                  <h3 className="text-xl font-semibold mb-2">Sample Nutrition Analysis</h3>
                  <p className="text-primary-light">Instant, detailed breakdown of any food item</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Calories</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">245 kcal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Protein</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">18.5g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Carbohydrates</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">32.1g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Fat</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">8.7g</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-secondary dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-gray-100">
              Ready to Transform Your Nutrition Journey?
            </h2>
            <p className="text-xl text-primary-light dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of users who have already discovered the power of AI-driven nutrition insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                as={Link} 
                to="/register" 
                variant="outline" 
                size="lg" 
                className="bg-white dark:bg-gray-800 text-primary dark:text-gray-100 border-white dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-lg px-8 py-4"
              >
                Start Your Free Trial
                <IoArrowForwardOutline className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;