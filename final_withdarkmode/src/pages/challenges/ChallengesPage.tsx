import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getChallenges, createCompletion } from '@/lib/db';
import { useAuth } from '@/lib/auth';
import { Challenge } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Leaf, CalendarIcon, Trophy } from 'lucide-react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadChallenges = () => {
      const allChallenges = getChallenges();
      setChallenges(allChallenges);
      setLoading(false);
    };

    loadChallenges();
  }, []);

  const handleJoinChallenge = (challengeId: string) => {
    if (!user) {
      toast.error('You must be logged in to join a challenge');
      return;
    }

    try {
      createCompletion({
        userId: user.id,
        challengeId,
      });
      toast.success('Challenge joined! Complete it to earn XP.');
    } catch (error) {
      toast.error('Failed to join challenge');
      console.error(error);
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sustainability Challenges</h1>
          <p className="text-muted-foreground">Join challenges to earn XP and make a difference.</p>
        </div>
        {user?.role === 'host' && (
          <Link to="/host/create-challenge">
            <Button className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700">
              Create Challenge
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading challenges...</div>
        </div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-12">
          <Leaf className="mx-auto h-12 w-12 text-green-600 opacity-50" />
          <h3 className="mt-4 text-lg font-semibold">No challenges available</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back soon for new sustainability challenges.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => {
            const expired = isExpired(challenge.endDate);
            
            return (
              <Card key={challenge.id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{challenge.title}</CardTitle>
                    <Badge variant={expired ? "outline" : "default"} className={expired ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-800"}>
                      {expired ? 'Ended' : 'Active'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <CalendarIcon className="h-3 w-3" />
                    Ends: {format(new Date(challenge.endDate), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">{challenge.description}</p>
                  <div className="flex items-center mt-4 gap-1 text-amber-600">
                    <Trophy className="h-4 w-4" />
                    <span className="text-sm font-medium">{challenge.xpValue} XP</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleJoinChallenge(challenge.id)}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={expired || !user}
                  >
                    {!user ? "Login to Join" : expired ? "Challenge Ended" : "Join Challenge"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}