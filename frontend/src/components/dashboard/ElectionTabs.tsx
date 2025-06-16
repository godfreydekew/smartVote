import React, { memo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ElectionsGrid from '@/components/dashboard/ElectionsGrid';
import { Activity, Calendar, CheckCheck, ChevronDown } from 'lucide-react';
import { useReadContract } from 'thirdweb/react';
import { useEffect } from 'react';
import { electionService } from '@/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from '@/auth/AuthProvider';
import { electionFactoryContract } from '@/utils/thirdweb-client';
import { useActiveAccount, useProfiles} from 'thirdweb/react';
import { Connect } from '../thirdweb/Connect';

interface Election {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'upcoming' | 'completed';
  date: string;
  address: string;
}

interface ElectionData {
  electionAddress: string;
  id: bigint;
  title: string;
  startTime: bigint;
  endTime: bigint;
  isPublic: boolean;
  owner: string;
}

// Map frontend states to contract states
const stateMapping = {
  'upcoming': 0, // UPCOMING
  'active': 1,   // ACTIVE
  'completed': 2 // COMPLETED
};

export const ElectionTabs = memo(() => {
  const [elections, setElections] = useState<Election[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const isMobile = useIsMobile();
  const {user} = useAuth(); 
  const isAdmin = user?.user_role === 'admin';

  // Fetch owner's elections if admin
  const { data: ownerElections, isPending: isOwnerElections } = useReadContract({
    contract: electionFactoryContract,
    method:
      "function getElectionsByOwner(address owner) view returns ((address electionAddress, uint256 id, string title, uint256 startTime, uint256 endTime, bool isPublic, address owner)[])",
    params: [user?.address],
  });

  // Fetch elections by state
  const { data: activeElectionsData, isPending: isActivePending } = useReadContract({
    contract: electionFactoryContract,
    method: "function getElectionsByState(uint8 _state) view returns ((address electionAddress, uint256 id, string title, uint256 startTime, uint256 endTime, bool isPublic, address owner)[])",
    params: [stateMapping['active']],
  });

  const { data: upcomingElectionsData, isPending: isUpcomingPending } = useReadContract({
    contract: electionFactoryContract,
    method: "function getElectionsByState(uint8 _state) view returns ((address electionAddress, uint256 id, string title, uint256 startTime, uint256 endTime, bool isPublic, address owner)[])",
    params: [stateMapping['upcoming']],
  });

  const { data: completedElectionsData, isPending: isCompletedPending } = useReadContract({
    contract: electionFactoryContract,
    method: "function getElectionsByState(uint8 _state) view returns ((address electionAddress, uint256 id, string title, uint256 startTime, uint256 endTime, bool isPublic, address owner)[])",
    params: [stateMapping['completed']],
  });

  useEffect(() => {
    const fetchElectionsWithMetadata = async () => {
      try {
        setIsLoading(true);
        const response = await electionService.getElections();
        
        // Combine contract data with database metadata
        const formatElections = (contractData: ElectionData[] | undefined, status: 'active' | 'upcoming' | 'completed') => {
          if (!contractData) return [];
          
          return contractData.map((item: ElectionData) => {
            const dbElection = response.elections?.find(e => e.id === Number(item.id));
            return {
              id: item.id.toString(),
              title: item.title,
              description: dbElection?.description || '',
              imageUrl: dbElection?.image_url,
              status: status,
              date: new Date(Number(item.startTime) * 1000).toLocaleDateString(),
              address: item.electionAddress,
            };
          });
        };

        let allElections: Election[] = [];

        if (isAdmin) {
          // For admin, use ownerElections and determine status based on timestamps
          if (ownerElections) {
            allElections = (ownerElections as ElectionData[]).map((item: ElectionData) => {
              const dbElection = response.elections?.find(e => e.id === Number(item.id));
              const now = Math.floor(Date.now() / 1000);
              let status: 'active' | 'upcoming' | 'completed';
              
              if (Number(item.startTime) > now) {
                status = 'upcoming';
              } else if (Number(item.endTime) < now) {
                status = 'completed';
              } else {
                status = 'active';
              }

              return {
                id: item.id.toString(),
                title: item.title,
                description: dbElection?.description || '',
                imageUrl: dbElection?.image_url,
                status,
                date: new Date(Number(item.startTime) * 1000).toLocaleDateString(),
                address: item.electionAddress,
              };
            });
          }
        } else {
          // For regular users, use state-based elections
          allElections = [
            ...formatElections(activeElectionsData as ElectionData[], 'active'),
            ...formatElections(upcomingElectionsData as ElectionData[], 'upcoming'),
            ...formatElections(completedElectionsData as ElectionData[], 'completed')
          ];
        }

        setElections(allElections);
      } catch (error) {
        console.error("Error fetching elections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if ((isAdmin && ownerElections) || (!isAdmin && activeElectionsData && upcomingElectionsData && completedElectionsData)) {
      fetchElectionsWithMetadata();
    }
  }, [isAdmin, ownerElections, activeElectionsData, upcomingElectionsData, completedElectionsData]);

  const activeElections = elections?.filter(e => e.status === 'active') || [];
  const upcomingElections = elections?.filter(e => e.status === 'upcoming') || [];
  const completedElections = elections?.filter(e => e.status === 'completed') || [];

  const tabOptions = [
    { value: 'active', label: 'Active Elections', icon: Activity, count: activeElections.length },
    { value: 'upcoming', label: 'Upcoming', icon: Calendar, count: upcomingElections.length },
    { value: 'completed', label: 'Completed', icon: CheckCheck, count: completedElections.length },
  ];

  if (isLoading || (!isAdmin && (isActivePending || isUpcomingPending || isCompletedPending)) || (isAdmin && isOwnerElections)) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="fixed left-[9999px]">
          <Connect />
        </div>
        <span>Loading Elections...</span>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      {isMobile ? (
        <div className="px-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue>
                {tabOptions.find(option => option.value === activeTab)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tabOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon size={16} />
                    <span>{option.label}</span>
                    <span className="ml-auto bg-gray-100 text-gray-800 text-xs py-0.5 px-2 rounded-full">
                      {option.count}
            </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="px-4">
          <TabsList className="bg-white p-1 rounded-lg inline-flex">
            {tabOptions.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-vote-blue data-[state=active]:text-white transition-colors duration-200"
              >
                <option.icon size={18} />
                <span>{option.label}</span>
                <span className="ml-1 bg-gray-100 text-gray-800 text-xs py-0.5 px-2 rounded-full data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  {option.count}
            </span>
          </TabsTrigger>
            ))}
        </TabsList>
      </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
      <TabsContent value="active">
        <ElectionsGrid elections={activeElections} />
      </TabsContent>
      <TabsContent value="upcoming">
        <ElectionsGrid elections={upcomingElections} />
      </TabsContent>
      <TabsContent value="completed">
        <ElectionsGrid elections={completedElections} />
      </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
});

ElectionTabs.displayName = 'ElectionTabs';
