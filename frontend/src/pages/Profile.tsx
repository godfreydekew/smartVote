import React, { useState } from 'react';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { AdminAccessPanel } from '@/components/profile/AdminAccessPanel';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthProvider';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Connect } from '@/components/thirdweb/Connect';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Mail, Globe, Calendar, User, CheckCircle2, XCircle, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDisconnect, useActiveWallet } from 'thirdweb/react';
import { userService } from '@/api';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ProfileData {
  address: string;
  age: number;
  country_of_residence: string;
  created_at: string;
  email: string;
  full_name: string;
  gender: string;
  id: number;
  kyc_verified: boolean;
  user_role: string;
}

const Profile = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      // First disconnect the wallet
      if (wallet) {
        await disconnect(wallet);
      }

      // Then delete the user account
      await userService.deleteUser(user.id);

      // Finally logout
      await logout();

      toast({
        title: t('profile.accountDeleted'),
        description: t('profile.accountDeletedDescription'),
        variant: 'success',
      });

      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: t('profile.error'),
        description: t('profile.errorDescription'),
        variant: 'destructive',
      });
    }
  };

  //when deleteing account
  const handleProfileUpdate = (data: ProfileData) => {
    console.log('Profile data updated:', data);
    toast({
      title: t('profile.profileUpdated'),
      description: t('profile.profileUpdatedDescription'),
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <DashboardHeader />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] overflow-hidden mb-8 hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300"
          >
            <div className="relative h-40 bg-gradient-to-r from-vote-blue to-vote-purple">
              <div className="absolute -bottom-16 left-8">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <User className="h-16 w-16 text-vote-blue" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-20 pb-6 px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user?.full_name}</h1>
                  <p className="text-gray-500 mt-1 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {user?.email}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                  <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="flex items-center px-4 py-2 text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('profile.deleteAccount')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delete Account Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center text-red-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {t('profile.deleteAccountTitle')}
                </DialogTitle>
                <DialogDescription className="pt-4">{t('profile.deleteAccountDescription')}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex space-x-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  {t('profile.cancel')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    handleDeleteAccount();
                  }}
                >
                  {t('profile.deleteAccount')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Main Content Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column - Profile Information */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div variants={itemVariants}>
                <Card className="p-8 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">{t('profile.personalInformation')}</h2>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                      {/* <Edit2 className="h-5 w-5 text-vote-blue" /> */}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                        <div className="p-3 rounded-full bg-vote-blue/10">
                          <Mail className="h-6 w-6 text-vote-blue" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('profile.email')}</p>
                          <p className="font-medium text-gray-900">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                        <div className="p-3 rounded-full bg-vote-blue/10">
                          <Globe className="h-6 w-6 text-vote-blue" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('profile.country')}</p>
                          <p className="font-medium text-gray-900 capitalize">{user?.country_of_residence}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                        <div className="p-3 rounded-full bg-vote-blue/10">
                          <User className="h-6 w-6 text-vote-blue" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('profile.age')}</p>
                          <p className="font-medium text-gray-900">
                            {user?.age} {t('profile.years')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                        <div className="p-3 rounded-full bg-vote-blue/10">
                          <Calendar className="h-6 w-6 text-vote-blue" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('profile.memberSince')}</p>
                          <p className="font-medium text-gray-900">{formatDate(user?.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-8 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-8">{t('profile.blockchainInformation')}</h2>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                      <div className="p-3 rounded-full bg-vote-blue/10">
                        <Shield className="h-6 w-6 text-vote-blue" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('profile.walletAddress')}</p>
                        <p className="font-mono text-sm break-all text-gray-900">{user?.address}</p>
                      </div>
                      <button onClick={() => disconnect(wallet)}>{t('profile.disconnect')}</button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Admin Panel & Connect */}
            <div className="space-y-8">
              <motion.div variants={itemVariants}>
                <AdminAccessPanel isAdmin={user?.user_role === 'admin'} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Connect />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
