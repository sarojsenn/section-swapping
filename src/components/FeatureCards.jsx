import { motion } from 'framer-motion';
import { FiRefreshCw, FiCalendar, FiUsers, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: <FiRefreshCw size={24} />,
    title: 'Smart Section Swapping',
    description: 'Post your current section, specify what you need, and let the algorithm find perfect mutual matches instantly.',
    link: '/swap',
    linkText: 'Go to Swap Board',
    color: 'emerald'
  },
  {
    icon: <FiCalendar size={24} />,
    title: '5th Semester Timetables',
    description: 'Easily view and manage your CSE core, PE-1, and PE-2 electives with unified daily and weekly schedule views.',
    link: '/timetable',
    linkText: 'View Timetable',
    color: 'blue'
  },
  {
    icon: <FiUsers size={24} />,
    title: 'Active Community Board',
    description: 'Connect with other students directly, negotiate complex swaps, and stay up to date with real-time campus activity.',
    link: '/swap',
    linkText: 'Browse Community',
    color: 'purple'
  }
];

export default function FeatureCards() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4"
          >
            Everything you need for the semester
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            KMate combines section swapping capabilities with your complete academic timetable, built specifically for KIIT students.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6
                ${feature.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                ${feature.color === 'blue' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : ''}
                ${feature.color === 'purple' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' : ''}
              `}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-500 dark:text-gray-400 mb-8 flex-grow leading-relaxed">
                {feature.description}
              </p>

              <Link 
                to={feature.link}
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
              >
                {feature.linkText}
                <FiArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
