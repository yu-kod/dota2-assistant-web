import dayjs from "dayjs";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import type { HeroHistoryItem } from "../context/AppContext";
import type { HeroSummary } from "../types/heroes";

interface HeroHistoryProps {
  items: HeroHistoryItem[];
  onSelect: (hero: HeroSummary) => void;
}

export function HeroHistory({ items, onSelect }: HeroHistoryProps) {
  if (!items.length) {
    return (
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          まだ履歴はありません。ランダムピックを行うとここに表示されます。
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">最近のピック履歴</Typography>
        <List dense disablePadding>
          {items.map((item) => (
            <ListItem key={`${item.hero.id}-${item.timestamp}`} disablePadding>
              <ListItemButton onClick={() => onSelect(item.hero)}>
                <ListItemAvatar>
                  <Avatar src={item.hero.icon} alt={item.hero.localizedName} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.hero.localizedName}
                  secondary={dayjs(item.timestamp).format("MM/DD HH:mm")}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Paper>
  );
}
