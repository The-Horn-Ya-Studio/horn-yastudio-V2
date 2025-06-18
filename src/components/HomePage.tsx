import React, { useEffect, useState } from 'react';
import { getFeaturedMembers, Member } from '../services/memberService';
import { Link } from 'react-router-dom';

const FeaturedMembers: React.FC = () => {
  const [featuredMembers, setFeaturedMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedMembers = async () => {
      try {
        // Get exactly 4 featured members
        const members = await getFeaturedMembers(4);
        setFeaturedMembers(members);
      } catch (error) {
        console.error('Failed to load featured members:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMembers();
  }, []);

  if (loading) {
    return <div>Loading featured members...</div>;
  }

  return (
    <section className="featured-members">
      <h2>Featured Members</h2>
      <div className="members-grid">
        {featuredMembers.length > 0 ? (
          featuredMembers.map(member => (
            <div key={member.id} className="member-card">
              <img 
                src={member.avatar_url} 
                alt={member.name} 
                className="member-avatar"
                loading="lazy" // For better performance
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <Link to={`/members/${member.id}`} className="member-link">
                View Profile
              </Link>
            </div>
          ))
        ) : (
          <p>No featured members found.</p>
        )}
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Other home page content */}
      <FeaturedMembers />
      {/* More home page content */}
    </div>
  );
};

export default HomePage;
