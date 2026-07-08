import PostRequestForm from '../components/PostRequestForm';
import MatchesSection from '../components/MatchesSection';
import CommunityBoard from '../components/CommunityBoard';
import { useEffect } from 'react';

export default function SwapBoard() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <PostRequestForm />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gray-100 dark:bg-white/5" />
      </div>
      <MatchesSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gray-100 dark:bg-white/5" />
      </div>
      <CommunityBoard />
    </div>
  );
}
