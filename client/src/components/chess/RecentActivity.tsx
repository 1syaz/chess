import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function RecentActivity() {
  return (
    <Card className="bg-background border-charcoal">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-charcoal rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white">Won against AIBot (Level 5)</span>
            </div>
            <Badge variant="secondary">+12 rating</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-charcoal rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-white">Lost to GrandMaster99</span>
            </div>
            <Badge variant="destructive">-8 rating</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-charcoal rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-white">Draw with ChessLover42</span>
            </div>
            <Badge variant="secondary">±0 rating</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
