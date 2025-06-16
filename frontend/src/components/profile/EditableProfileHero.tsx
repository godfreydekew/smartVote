
import React, { useState } from 'react';
import { User, Camera, Lock, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileHeroProps {
  onSave: (data: any) => void;
  user: any;
}

export const EditableProfileHero = ({ onSave, user }: ProfileHeroProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user.full_name,
    lastName: '',
    email: user.email,
    password: '••••••••',
    birthDate: new Date('1990-01-01'),
    country: 'United States',
    verificationStatus: 'Verified', // or 'Pending'
    profilePicture: ''
  });
  
  console.log("EditableProfileHero: user", user);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setSelectedImage(null);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    onSave({
      ...userData,
      profilePicture: selectedImage
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setUserData({
        ...userData,
        birthDate: date
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Japan", "Brazil", "India", "China", "South Africa"
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          {previewImage || userData.profilePicture ? (
            <img 
              src={previewImage || userData.profilePicture}
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-2 border-vote-blue"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-vote-blue/20 flex items-center justify-center">
              <User size={40} className="text-vote-blue" />
            </div>
          )}
          
          {isEditing && (
            <div className="absolute bottom-0 right-0">
              <Label 
                htmlFor="profile-image" 
                className="w-8 h-8 rounded-full bg-vote-blue text-white flex items-center justify-center cursor-pointer hover:bg-vote-blue/90 transition-colors"
              >
                <Camera size={16} />
              </Label>
              <Input 
                id="profile-image" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <div className="space-y-4 max-w-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email (non-editable)</Label>
                <Input 
                  id="email"
                  value={userData.email}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="birthdate">Date of Birth (18+ only)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(userData.birthDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={userData.birthDate}
                      onSelect={handleDateChange}
                      disabled={(date) => {
                        // Disable dates less than 18 years ago
                        const eighteenYearsAgo = new Date();
                        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
                        return date > eighteenYearsAgo || date < new Date("1900-01-01");
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="country">Country/Region</Label>
                <Select 
                  value={userData.country} 
                  onValueChange={(value) => handleSelectChange('country', value)}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center md:justify-start mb-2">
                <h2 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h2>
                {userData.verificationStatus === 'Verified' && (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                    <Check className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {userData.verificationStatus === 'Pending' && (
                  <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                    Pending
                  </Badge>
                )}
              </div>
              <p className="text-gray-500 mb-2">{userData.email}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Age: {calculateAge(userData.birthDate)}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">🌎</span>
                  {userData.country}
                </span>
              </div>
              <div className="mb-4 flex items-center text-xs text-gray-500">
                <Lock className="w-3 h-3 mr-1" />
                Your data is end-to-end encrypted
              </div>
              <div className="mt-6">
                <Button onClick={handleEdit}>
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
