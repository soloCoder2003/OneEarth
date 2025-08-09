import { useEffect, useState } from 'react';
import { withAuth } from '@/lib/auth';
import { useAuth } from '@/lib/auth';
import { getCompletionsByUserId, getChallengeById } from '@/lib/db';
import { ChallengeCompletion, Challenge } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface CompletionWithChallenge extends ChallengeCompletion {
  challenge?: Challenge;
}

function ProfilePage() {
  const { user } = useAuth();
  const [completions, setCompletions] = useState<CompletionWithChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompletions = () => {
      if (!user) return;

      const userCompletions = getCompletionsByUserId(user.id);
      
      // Enrich completions with challenge data
      const enrichedCompletions = userCompletions.map(completion => {
        return {
          ...completion,
          challenge: getChallengeById(completion.challengeId),
        };
      });
      
      setCompletions(enrichedCompletions);
      setLoading(false);
    };

    loadCompletions();
  }, [user]);

  // Calculate statistics
  const approvedCount = completions.filter(c => c.status === 'approved').length;
  const pendingCount = completions.filter(c => c.status === 'pending').length;
  const rejectedCount = completions.filter(c => c.status === 'rejected').length;
  
  // Calculate the next XP milestone
  const currentXP = user?.xp || 0;
  const nextMilestone = Math.ceil(currentXP / 100) * 100;
  const progress = (currentXP % 100) / 100 * 100;

  if (!user) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarFallback className="text-2xl bg-green-600 text-white">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow text-center sm:text-left">
                <CardTitle className="text-2xl font-bold">{user.username}</CardTitle>
                <CardDescription className="mb-2">{user.email}</CardDescription>
                {user.role === 'user' ? (
                  <div className="mt-2">
                    <div className="flex items-center justify-center sm:justify-start mb-1">
                      <span className="text-lg font-bold">{user.xp} XP</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {nextMilestone - currentXP} XP to next milestone
                      </span>
                    </div>
                    <Progress value={progress} className="h-2 w-full" />
                  </div>
                ) : (
                  <Badge className="bg-blue-600">Host</Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {user.role === 'user' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Challenge Activity</h2>
            
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-6 w-6 mr-2 text-green-600" />
                    <span className="text-2xl font-bold">{approvedCount}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 mr-2 text-amber-600" />
                    <span className="text-2xl font-bold">{pendingCount}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <XCircle className="h-6 w-6 mr-2 text-red-600" />
                    <span className="text-2xl font-bold">{rejectedCount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Challenge History</h2>
            
            {loading ? (
              <div className="text-center py-8">Loading challenge history...</div>
            ) : completions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p>You haven't joined any challenges yet.</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700" asChild>
                    <a href="/challenges">Browse Challenges</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completions.map((completion) => (
                  <Card key={completion.id}>
                    <CardContent className="py-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                          <h3 className="font-semibold">{completion.challenge?.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(completion.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          {completion.status === 'approved' && (
                            <div className="flex items-center">
                              <Badge className="bg-green-100 text-green-800 mr-2">Approved</Badge>
                              <span className="text-sm font-medium">+{completion.challenge?.xpValue} XP</span>
                            </div>
                          )}
                          {completion.status === 'pending' && (
                            <Badge className="bg-amber-100 text-amber-800">Pending Approval</Badge>
                          )}
                          {completion.status === 'rejected' && (
                            <Badge className="bg-red-100 text-red-800">Not Approved</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);