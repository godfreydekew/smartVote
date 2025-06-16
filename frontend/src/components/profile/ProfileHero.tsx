
import React from 'react';
import { EditableProfileHero } from './EditableProfileHero';

interface ProfileHeroProps {
  onSave: (data: any) => void;
  user: any;
}

export const ProfileHero = (props: ProfileHeroProps) => {
  return <EditableProfileHero onSave={props.onSave} user={props.user} />;
};
