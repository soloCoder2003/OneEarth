import { useState, useEffect } from 'react';
import { getRewards } from '@/lib/db';
import { useAuth } from '@/lib/auth';
import { Reward } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Gift, AlertCircle } from 'lucide-react';

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadRewards = () => {
      const allRewards = getRewards();
      setRewards(allRewards);
      setLoading(false);
    };

    loadRewards();
  }, []);

  const handleClaimReward = (reward: Reward) => {
    if (!user) {
      toast.error('You must be logged in to claim a reward');
      return;
    }

    if (user.xp < reward.xpCost) {
      toast.error(`Not enough XP. You need ${reward.xpCost - user.xp} more XP to claim this reward.`);
      return;
    }

    // For demo purposes, just show a success message
    toast.success('For this demo, claiming is simulated. In a real app, this would process the claim.');
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rewards</h1>
          <p className="text-muted-foreground">Redeem your XP for eco-friendly rewards.</p>
        </div>
        {user?.role === 'user' && (
          <div className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-green-800 text-white px-4 py-2 rounded-md">
            <span className="font-semibold">Your XP Balance:</span> {user.xp} XP
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading rewards...</div>
        </div>
      ) : rewards.length === 0 ? (
        <div className="text-center py-12">
          <Gift className="mx-auto h-12 w-12 text-green-600 opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">No rewards available</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon for new rewards.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward) => (
            <Card key={reward.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{reward.title}</CardTitle>
                  <Badge variant={reward.available ? "default" : "outline"} className={reward.available ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}>
                    {reward.available ? 'Available' : 'Out of Stock'}
                  </Badge>
                </div>
                <CardDescription>Offered by: {reward.hostName}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">{reward.description}</p>
                <div className="flex items-center mt-4 gap-1 text-amber-600">
                  <Gift className="h-4 w-4" />
                  <span className="text-sm font-medium">Cost: {reward.xpCost} XP</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleClaimReward(reward)}
                  className={`w-full ${
                    user && user.xp >= reward.xpCost
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                  }`}
                  disabled={!user || !reward.available || user.xp < reward.xpCost}
                >
                  {!user
                    ? "Login to Claim"
                    : !reward.available
                    ? "Not Available"
                    : user.xp < reward.xpCost
                    ? `Need ${reward.xpCost - user.xp} more XP`
                    : "Claim Reward"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 border border-amber-200 bg-amber-50 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
        <div>
          <h3 className="font-medium text-amber-800">Hackathon Demo Note</h3>
          <p className="text-sm text-amber-700 mt-1">
            This is a demo for the IEEE hackathon. In a production app, claiming rewards would connect to a real reward fulfillment system.
          </p>
        </div>
      </div>
    </div>
  );
}