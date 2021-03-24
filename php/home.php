<!doctype html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="./js/home.js"></script>
        
        <title>ProgWeb | Voting</title>
    </head>
    <body>
        <main>
            <h1 id="Ballots">Ballots</h1>
            <table id ="content">
                <tr><th>Title</th><th>Promoter</th><th>Participation rate</th></tr>
                <?php
                    $jsonString = file_get_contents('../logs/ballots.json');
                    $data = json_decode($jsonString, true);

                    $jsonString = file_get_contents('../logs/users_log.json');
                    $users = json_decode($jsonString, true);
                    $countUsers = 0;
                    foreach ($users as $i=>$etu)
                    {
                        $countUsers = $countUsers + 1;
                    }

                    foreach ($data as $i=>$etu)
                    {
                        $title = $etu['title'];
                        $promoter = $etu['promoter'];
                        $countVoters = 0;
                        foreach($etu['voters'] as $i=>$etu)
                        {
                            $countVoters = $countVoters + 1;
                        }
                        $pr = ($countVoters/$countUsers)*100;
                        echo "<tr><td>$title</td><td>$promoter</td><td>$pr%</td>";
                        echo "  <td> <form method='GET' action='ballot.php'>";
                        echo "    <input type='hidden' name='title' value=\"$title\">";
                        echo "    <input type='hidden' name='promoter' value=\"$promoter\">";
                        echo "    <input type='submit' value='Check'></form></tr>\n";
                    }
                    echo "</table><br>";
                    echo "<a href='#' id='create-ballot' onclick=''>+  Create new ballot</a>";
                ?>
        </main>
    </body>
</html>