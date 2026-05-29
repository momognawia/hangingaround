export type UserFrequency = 'weekly' | 'biweekly' | 'monthly';
export type SubscriptionStatus = 'active' | 'inactive' | 'trial';
export type VerificationStatus = 'none' | 'phone' | 'photo' | 'full';
export type Gender = 'male' | 'female' | 'non_binary' | 'other';
export type Orientation = 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'other' | 'prefer_not';

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  birthDate?: string;
  gender?: Gender;
  orientation?: Orientation;
  bio?: string;
  city?: string;
  profilePhotoUrl?: string;
  photos?: string[];
  interests?: string[];
  preferredFrequency: UserFrequency;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId?: string;
  reputationScore: number;
  verificationStatus: VerificationStatus;
  fcmToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
