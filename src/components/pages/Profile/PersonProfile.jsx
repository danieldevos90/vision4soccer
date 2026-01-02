import React from 'react';
import { Heading } from '../../ui/Heading/Heading';
import { Text } from '../../ui/Text/Text';
import styles from './PersonProfile.module.css';

/**
 * PersonProfile Component
 * Displays a profile card for a team member
 */
export const PersonProfile = ({ name, bio, career, image }) => {
  return (
    <article className={styles.personProfile}>
      <div className={styles.profileCard}>
        {image && (
          <div className={styles.imageContainer}>
            <img src={image} alt={name} className={styles.image} />
          </div>
        )}
        <div className={styles.textContent}>
          <Heading level={2} className={styles.name}>
            {name}
          </Heading>
          {bio && (
            <Text className={styles.bio}>
              {bio}
            </Text>
          )}
          {career && career.length > 0 && (
            <div className={styles.career}>
              {career.map((item, index) => (
                <div key={index} className={styles.careerItem}>
                  <span className={styles.careerIcon}>⚽</span>
                  <Text className={styles.careerText}>
                    {item.period} - {item.club}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
