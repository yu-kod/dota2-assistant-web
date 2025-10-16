import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import type { HeroDetail, HeroSummary } from "../types/heroes";
import { HeroPositionsEditor } from "./HeroPositionsEditor";

interface HeroCardProps {
  hero: HeroDetail | HeroSummary;
  loading?: boolean;
  availablePositions: readonly string[];
  defaultPositions: string[];
  onPositionsChange: (positions: string[]) => void;
}

export function HeroCard({
  hero,
  loading = false,
  availablePositions,
  defaultPositions,
  onPositionsChange,
}: HeroCardProps) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
        >
          <Avatar
            variant="rounded"
            src={hero.image}
            alt={hero.localizedName}
            sx={{ width: 160, height: 160, borderRadius: 4 }}
          />
          <Stack spacing={1} flex={1} width="100%">
            <Typography variant="h5">{hero.localizedName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {hero.roles?.join(", ") ?? "ロール不明"}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label={`属性: ${String(
                  hero.primaryAttr || "不明"
                ).toUpperCase()}`}
                color="primary"
              />
              <Chip
                label={`攻撃タイプ: ${String(hero.attackType || "不明")}`}
                color="secondary"
              />
              {hero.positions?.map((position) => (
                <Chip key={position} label={position} variant="outlined" />
              )) ?? []}
            </Stack>
            <HeroPositionsEditor
              positions={hero.positions ?? []}
              defaultPositions={defaultPositions}
              availablePositions={availablePositions}
              onChange={onPositionsChange}
            />
          </Stack>
        </Stack>

        <Divider />

        {loading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : "baseHealth" in hero ? (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Stat label="HP" value={hero.baseHealth} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stat label="MP" value={hero.baseMana} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stat label="アーマー" value={hero.baseArmor} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stat label="移動速度" value={hero.moveSpeed} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stat
                label="攻撃力"
                value={
                  hero.baseAttackMin != null && hero.baseAttackMax != null
                    ? `${hero.baseAttackMin} - ${hero.baseAttackMax}`
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stat label="攻撃射程" value={hero.attackRange} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stat label="筋力" value={hero.baseStr} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stat label="敏捷" value={hero.baseAgi} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Stat label="知力" value={hero.baseInt} />
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            詳細情報を読み込み中です...
          </Typography>
        )}

        {"description" in hero && hero.description ? (
          <Typography variant="body2" color="text.secondary">
            {hero.description}
          </Typography>
        ) : null}

        {"abilities" in hero && hero.abilities?.length ? (
          <Stack spacing={1}>
            <Typography variant="subtitle1">アビリティ</Typography>
            {hero.abilities?.map((ability) => (
              <Accordion key={ability.name} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">{ability.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {ability.description}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    {ability.cooldown?.length ? (
                      <Stat
                        label="Cooldown"
                        value={ability.cooldown.join(" / ")}
                      />
                    ) : null}
                    {ability.manaCost?.length ? (
                      <Stat label="Mana" value={ability.manaCost.join(" / ")} />
                    ) : null}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        ) : null}

        {"talents" in hero && hero.talents?.length ? (
          <Stack spacing={1}>
            <Typography variant="subtitle1">タレント</Typography>
            <Stack spacing={1}>
              {hero.talents?.map((talent) => (
                <Chip
                  key={talent.name}
                  label={talent.name}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}

function Stat({ label, value }: { label: string; value?: number | string }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value ?? "-"}</Typography>
    </Stack>
  );
}
