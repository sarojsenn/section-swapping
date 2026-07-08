import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';

export default function Landing() {
  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gray-100 dark:bg-white/5" />
      </div>
      <FeatureCards />
    </div>
  );
}
