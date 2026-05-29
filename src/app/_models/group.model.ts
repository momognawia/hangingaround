export type GroupStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type AttendanceStatus = 'pending' | 'confirmed' | 'checked_in' | 'no_show';

export interface Group {
  id: string;
  themeId: string;
  rotationNumber: number;
  restaurantId: string;
  eventDate: Date;
  eventTime: string;
  status: GroupStatus;
  createdAt: Date;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  joinedAt: Date;
  attendanceStatus: AttendanceStatus;
}
