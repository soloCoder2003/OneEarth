import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/lib/db';
import { User } from '@/lib/types';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = () => {
      const users = getLeaderboard();
      setLeaderboard(users);
      setLoading(false);
    };

    loadLeaderboard();
  }, []);

  const getPositionStyle = (position: number) => {
    if (position === 0) return { icon: <Trophy className="h-5 w-5 text-yellow-500" />, textColor: 'text-yellow-500' };
    if (position === 1) return { icon: <Medal className="h-5 w-5 text-gray-400" />, textColor: 'text-gray-400' };
    if (position === 2) return { icon: <Medal className="h-5 w-5 text-amber-600" />, textColor: 'text-amber-600' };
    return { icon: null, textColor: '' };
  };

  return (
    <div className="container py-8">
      <Card className="border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Leaderboard</CardTitle>
          <CardDescription>Top sustainability champions ranked by XP</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg">Loading leaderboard...</div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-green-600 opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No data available</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete challenges to be the first on the leaderboard!
              </p>
            </div>
          ) : (
            <Table>
              <TableCaption>Rankings updated in real-time.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">XP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((user, index) => {
                  const { icon, textColor } = getPositionStyle(index);
                  
                  return (
                    <TableRow key={user.id} className={index < 3 ? 'font-medium' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {icon || <span className={`${textColor}`}>{index + 1}</span>}
                          {icon && <span className="ml-2">{index + 1}</span>}
                        </div>
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell className="text-right font-semibold">{user.xp} XP</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}