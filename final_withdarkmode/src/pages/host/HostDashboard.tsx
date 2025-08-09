import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getChallengesByHostId, getPendingCompletionsForHost, updateCompletion } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { useAuth } from '@/lib/auth';
import { Challenge, ChallengeCompletion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Leaf, Plus, Clock } from 'lucide-react';

function HostDashboard() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [pendingCompletions, setPendingCompletions] = useState<Array<ChallengeCompletion & { challenge: Challenge, user: { username: string } }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      if (!user) return;

      const hostChallenges = getChallengesByHostId(user.id);
      setChallenges(hostChallenges);
      
      const completions = getPendingCompletionsForHost(user.id);
      setPendingCompletions(completions);
      
      setLoading(false);
    };

    loadData();
  }, [user]);

  const handleApproveCompletion = (completionId: string) => {
    const completion = pendingCompletions.find(c => c.id === completionId);
    if (!completion) return;

    updateCompletion({
      ...completion,
      status: 'approved'
    });

    toast.success('Challenge completion approved and XP awarded!');
    
    // Update pending completions list
    setPendingCompletions(prev => prev.filter(c => c.id !== completionId));
  };

  const handleRejectCompletion = (completionId: string) => {
    const completion = pendingCompletions.find(c => c.id === completionId);
    if (!completion) return;

    updateCompletion({
      ...completion,
      status: 'rejected'
    });

    toast.success('Challenge completion rejected');
    
    // Update pending completions list
    setPendingCompletions(prev => prev.filter(c => c.id !== completionId));
  };

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Host Dashboard</h1>
          <p className="text-muted-foreground">Manage your challenges and review submissions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/host/create-challenge">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="pending" className="flex-1 sm:flex-none">
            <Clock className="h-4 w-4 mr-2" />
            Pending Approvals
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex-1 sm:flex-none">
            <Leaf className="h-4 w-4 mr-2" />
            Your Challenges
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Review and approve or reject challenge completions</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingCompletions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-8 w-8 text-green-600 opacity-50" />
                  <h3 className="mt-4 text-lg font-semibold">No pending approvals</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    When users complete your challenges, they'll appear here for approval.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingCompletions.map((completion) => (
                      <TableRow key={completion.id}>
                        <TableCell>{completion.user.username}</TableCell>
                        <TableCell>{completion.challenge.title}</TableCell>
                        <TableCell>{new Date(completion.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm"
                              variant="outline" 
                              className="border-green-500 text-green-500 hover:bg-green-50"
                              onClick={() => handleApproveCompletion(completion.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-50"
                              onClick={() => handleRejectCompletion(completion.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Your Challenges</CardTitle>
              <CardDescription>Manage and monitor your created challenges</CardDescription>
            </CardHeader>
            <CardContent>
              {challenges.length === 0 ? (
                <div className="text-center py-8">
                  <Leaf className="mx-auto h-8 w-8 text-green-600 opacity-50" />
                  <h3 className="mt-4 text-lg font-semibold">No challenges yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Start creating sustainability challenges for users to join.
                  </p>
                  <Link to="/host/create-challenge">
                    <Button className="mt-4 bg-green-600 hover:bg-green-700">
                      Create Your First Challenge
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {challenges.map((challenge) => (
                    <Card key={challenge.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <CardDescription>
                          {new Date(challenge.endDate) < new Date() 
                            ? `Ended on ${new Date(challenge.endDate).toLocaleDateString()}`
                            : `Ends on ${new Date(challenge.endDate).toLocaleDateString()}`
                          }
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-2 mb-2">{challenge.description}</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>XP Value: {challenge.xpValue}</span>
                          <Link to={`/host/challenge/${challenge.id}`}>
                            <span className="text-green-600 hover:underline">View Details</span>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAuth(HostDashboard, 'host');