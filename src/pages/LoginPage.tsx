import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signInWithUsername, signUpWithUsername } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sign-in state
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign-up state
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInUsername.trim() || !signInPassword) {
      toast.error('Please enter your username and password.');
      return;
    }
    setLoading(true);
    const { error } = await signInWithUsername(signInUsername.trim(), signInPassword);
    setLoading(false);
    if (error) {
      toast.error(error.message ?? 'Invalid credentials. Please try again.');
    } else {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error('Please agree to the User Agreement and Privacy Policy.');
      return;
    }
    if (!signUpUsername.trim() || !signUpPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(signUpUsername.trim())) {
      toast.error('Username may only contain letters, digits, and underscores.');
      return;
    }
    if (signUpPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (signUpPassword !== signUpConfirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await signUpWithUsername(signUpUsername.trim(), signUpPassword);
    setLoading(false);
    if (error) {
      toast.error(error.message ?? 'Registration failed. Please try again.');
    } else {
      toast.success('Account created! You are now signed in.');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        {/* Brand */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            Open<span className="text-primary">Connect</span>
          </span>
        </Link>

        <Card className="max-w-[calc(100%-0rem)] shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Welcome</CardTitle>
            <CardDescription>Sign in or create your Open Connect account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Register</TabsTrigger>
              </TabsList>

              {/* ── Sign In ── */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="si-username">Username</Label>
                    <Input
                      id="si-username"
                      placeholder="your_username"
                      value={signInUsername}
                      onChange={e => setSignInUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="si-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="si-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={signInPassword}
                        onChange={e => setSignInPassword(e.target.value)}
                        autoComplete="current-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              {/* ── Register ── */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-username">Username</Label>
                    <Input
                      id="su-username"
                      placeholder="your_username"
                      value={signUpUsername}
                      onChange={e => setSignUpUsername(e.target.value)}
                      autoComplete="username"
                    />
                    <p className="text-xs text-muted-foreground">Letters, digits, and underscores only.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="su-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        value={signUpPassword}
                        onChange={e => setSignUpPassword(e.target.value)}
                        autoComplete="new-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-confirm">Confirm Password</Label>
                    <Input
                      id="su-confirm"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={signUpConfirm}
                      onChange={e => setSignUpConfirm(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <Checkbox
                      id="agree"
                      checked={agreed}
                      onCheckedChange={v => setAgreed(v === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="agree" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <span className="text-primary underline underline-offset-2">User Agreement</span>
                      {' '}and{' '}
                      <span className="text-primary underline underline-offset-2">Privacy Policy</span>
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading || !agreed}>
                    {loading ? 'Creating account…' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 Open Connect · All rights reserved
        </p>
      </div>
    </div>
  );
}
