import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChallenge } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

function CreateChallenge() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpValue, setXpValue] = useState(50);
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!title || !description || !xpValue || !endDate) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      createChallenge({
        title,
        description,
        xpValue,
        hostId: user.id,
        hostName: user.username,
        endDate: new Date(endDate).toISOString(),
      });
      
      toast.success('Challenge created successfully!');
      navigate('/host/dashboard');
    } catch (error) {
      toast.error('Failed to create challenge');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the minimum date for the date input (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/host/dashboard')} 
        className="mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Challenge</CardTitle>
          <CardDescription>Create a new sustainability challenge for users to join</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title</Label>
              <Input
                id="title"
                placeholder="e.g., Plastic-Free Week"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what users need to do to complete this challenge..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="xpValue">XP Value</Label>
              <Input
                id="xpValue"
                type="number"
                min="1"
                max="1000"
                value={xpValue}
                onChange={(e) => setXpValue(parseInt(e.target.value) || 0)}
                required
              />
              <p className="text-xs text-muted-foreground">
                The amount of XP users will earn for completing this challenge.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                min={minDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                The date when this challenge will end.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Challenge'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default withAuth(CreateChallenge, 'host');